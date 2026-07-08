# flea-market-worker

The flea-market **backend Worker** (Cloudflare Workers), mounting Better Auth
(`@nemtus/auth`) on D1 + KV. Runs **alongside** the existing Firebase app during
coexistence; the SPA is pointed here per-feature as migration proceeds.

Backend-only (no React), so it is a workspace (`apps/*/worker`) and can consume the
shared `@nemtus/*` packages — unlike the standalone React frontends.

## Routes

- `GET /health`
- `ANY /api/auth/*` — Better Auth (sign-in/up, sessions, OAuth callbacks, reset, …)
- `POST /api/orders` — auth + KYC gated; creates a `PENDING` order and a Stripe
  Checkout session, returns `{ orderId, url }`
- `GET /api/files/<key>` — serves migrated product images from R2 (keys under
  `.../images/...`); replaces Firebase Storage download URLs
- `POST /api/stripe/webhook` — verifies the signature and advances the D1 order
  (`checkout.session.completed → PAID`, `async_payment_failed → FAILED`,
  `charge.refunded → REFUNDED`). Bypasses auth; uses the raw body.

Lazy Firebase password migration and the rehash-on-login hook are handled inside
`@nemtus/auth`; this Worker supplies bindings + config. The D1 schema is the
combined auth (`@nemtus/db`) + flea-market domain (`store`/`item`/`order`) set,
generated here (`npm run db:generate`, `migrations_dir → migrations`).

## Provisioning (fill the `TODO_*` ids in wrangler.toml)

```bash
wrangler d1 create nemtus-core
wrangler kv namespace create SESSION_KV
wrangler r2 bucket create nemtus-flea-market

# apply the shared auth schema to D1:
wrangler d1 migrations apply nemtus-core --remote   # migrations_dir → migrations (combined auth + flea-market)

# secrets:
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put FIREBASE_SIGNER_KEY       # base64 hash_config.base64_signer_key
wrangler secret put FIREBASE_SALT_SEPARATOR   # base64 hash_config.base64_salt_separator
wrangler secret put AWS_ACCESS_KEY_ID
wrangler secret put AWS_SECRET_ACCESS_KEY
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
# + any *_CLIENT_ID / *_CLIENT_SECRET for social providers
# and [vars]: CHECKOUT_SUCCESS_URL / CHECKOUT_CANCEL_URL
```

## User migration (ETL)

```bash
firebase auth:export users.json --project symbol-fest-market
npm run etl:users -- users.json > users.sql      # or: node --experimental-strip-types scripts/etl-users.ts users.json
wrangler d1 execute nemtus-core --file=users.sql --remote
```

Preserves the Firebase uid as `user.id`; credential users import with a
`firebase-scrypt$…` marker (verified + lazily re-hashed on first login); federated
identities become per-provider `account` rows; custom claims → admin role + KYC fields.

## Domain migration (Firestore → D1)

Two stages — run **after** the user ETL (orders/stores reference `user.id`):

```bash
# 1. dump Firestore to JSONL (needs Admin credentials)
GOOGLE_APPLICATION_CREDENTIALS=./sa.json \
  node --experimental-strip-types scripts/dump-firestore.ts ./firestore-dump

# 2. transform → D1 SQL (pure) and apply
node --experimental-strip-types scripts/etl-domain.ts ./firestore-dump > domain.sql
wrangler d1 execute nemtus-core --file=domain.sql --remote
```

Firestore stored no timestamps, so `created_at`/`updated_at` come from the document
`createTime`/`updateTime` metadata captured at dump time. Orders were denormalized
(User+Store+Item in one doc), so shipping + item name are snapshotted onto the order,
and legacy `orderStatus` maps to `payment_status` (`CONFIRMED`/`SENT`→`PAID`,
`TIMEOUT`/`ABORTED`→`FAILED`, else `PENDING`); the XYM tx hash is kept in
`legacy_symbol_tx_hash`. The transform loads with foreign_keys OFF and **reports orders
that reference now-deleted items** — review that count before applying to production.

## Storage migration (Firebase Storage → R2)

```bash
# copy all objects to R2 (preserves keys); needs Admin creds + R2 S3 creds
GOOGLE_APPLICATION_CREDENTIALS=./sa.json FIREBASE_STORAGE_BUCKET=symbol-fest-market.appspot.com \
R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... R2_BUCKET=nemtus-flea-market \
  node --experimental-strip-types scripts/copy-storage.ts
```

The domain ETL (`etl-domain.ts`) rewrites store/item image references from Firebase
download URLs to `/api/files/<key>`, where `<key>` is the original Storage path (also
the R2 key the copy preserves). The Worker's `GET /api/files/*` route serves them from
R2, so no image data lives in Firebase after cutover.

> ⚠️ Validate `firebaseScryptVerify` against a real exported hash before cutover.
