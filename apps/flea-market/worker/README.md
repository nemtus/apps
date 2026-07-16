# nemtus-flea-market-api

The flea-market **backend Worker** (Cloudflare Workers): the shared NEMTUS core (Better Auth on
D1 + KV) plus the flea-market domain REST API, R2 file serving, XYM settlement verification, and the
Stripe webhook. This is the flea-market SPA's **sole backend** — the frontend is fully off Firebase.

Backend-only (no React), so it is an npm-workspace member (`apps/*/worker`) and consumes the shared
`@nemtus/*` packages — unlike the standalone React frontends. See `GO-LIVE.md` for the provisioning
+ cutover runbook.

## Routes

- `GET /health`
- `ANY /api/auth/*` — Better Auth (sign-in/up, sessions, OAuth, email verification, password reset).
  Cross-subdomain (`.nemtus.com`), so one NEMTUS session works across apps.
- **`/api/flea-market/*`** — the domain REST API (auth via the session cookie):
  - `GET  /config` — feature flags.
  - `GET  /stores`, `/stores/:id`, `/stores/:id/items`, `/stores/:id/items/:itemId` — public browse
    (published stores only = owner passed store KYC).
  - `GET|PUT /me`, `GET|PUT /me/store`, `GET|POST|PUT /me/store/items[/:itemId]` — owner profile /
    store / items.
  - `POST /me/store/verify-email/challenge` + `POST /me/store/verify-email` — store-email KYC (a SES
    code → verify → sets `storeEmailVerified` + recomputes `storeKycVerified`).
  - `POST /me/uploads` — store/item image upload to R2.
  - `GET  /me/orders`, `/me/store/orders`, `/orders/:id` — orders (buyer list / store list / detail).
  - `POST /orders` — create an order. **Dual-rail** via `paymentMethod`: `STRIPE` → `{ orderId, url }`
    (Checkout); `XYM` → `{ orderId }` (the client renders the on-chain transfer QR).
  - `POST /orders/:id/verify-payment` — the buyer's client polls this; the Worker independently
    re-verifies the on-chain XYM transfer via the Symbol REST node (recipient / amount / message ==
    orderId) and advances the order to `CONFIRMED`.
- `GET  /api/flea-market/files/<key>` — serves images from R2 (keys under `.../images/...`);
  replaces the old Firebase Storage download URLs.
- `POST /api/flea-market/stripe/webhook` — verifies the signature and advances the D1 order
  (`checkout.session.completed → PAID`, `async_payment_failed → FAILED`, `charge.refunded →
  REFUNDED`). Bypasses auth; uses the raw body.

Lazy Firebase password migration + the rehash-on-login hook live in `@nemtus/auth`; this Worker
supplies the bindings + config. The D1 schema is the combined auth (`@nemtus/db`) + flea-market domain
(`store` / `item` / `order` / `user_profile`) set, in `migrations/`.

## Provisioning

Bindings/ids and **non-secret `[vars]` live in `wrangler.toml`** (version-controlled, applied on each
deploy); **only secrets are provisioned separately** in the Cloudflare dashboard (or `wrangler secret
put`) — the worker deploys via Cloudflare Workers Builds from `main`, so nothing secret lives in the
repo, and dashboard plaintext vars are avoided (a deploy would override them). `GO-LIVE.md` is the
authoritative provisioning + secrets/vars checklist. Quick reference:

```bash
wrangler d1 create nemtus-core-d1                       # shared NEMTUS core D1 -> database_id
wrangler kv namespace create nemtus-core-session-kv  # -> SESSION_KV id (shared Better Auth sessions)
wrangler kv namespace create nemtus-flea-market-kv   # -> APP_KV id (XYM price cache + store-email codes)
wrangler r2 bucket create nemtus-flea-market-r2

wrangler d1 migrations apply nemtus-core-d1 --remote   # migrations_dir -> migrations (combined auth + flea-market)
```

Secrets (dashboard, or `wrangler secret put`): `BETTER_AUTH_SECRET`, `AWS_ACCESS_KEY_ID` /
`AWS_SECRET_ACCESS_KEY`, `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`, `FIREBASE_SIGNER_KEY` /
`FIREBASE_SALT_SEPARATOR` (+ optional `FIREBASE_ROUNDS` / `FIREBASE_MEM_COST` if they differ from the
8 / 14 code defaults — kept as secrets so all `FIREBASE_*` live together), optional `COINMARKETCAP_API_KEY`
+ social `*_CLIENT_ID`/`*_CLIENT_SECRET`.
Vars (`[vars]`): `AUTH_BASE_URL`, `TRUSTED_ORIGINS`, `AWS_SES_FROM`, `AWS_SES_CONFIGURATION_SET`, `CHECKOUT_SUCCESS_URL` /
`CHECKOUT_CANCEL_URL`, `SYMBOL_NODE_URL`, `SYMBOL_CURRENCY_MOSAIC_ID`, and the `ENABLE_*` flags. The
Stripe webhook endpoint is `<AUTH_BASE_URL>/api/flea-market/stripe/webhook`.

## User migration (ETL)

```bash
firebase auth:export users.json --project symbol-fest-market
npm run etl:users -- users.json > users.sql      # or: node --experimental-strip-types scripts/etl-users.ts users.json
wrangler d1 execute nemtus-core-d1 --file=users.sql --remote
```

Preserves the Firebase uid as `user.id`; credential users import with a `firebase-scrypt$…` marker
(verified + lazily re-hashed on first login); federated identities become per-provider `account` rows;
custom claims → admin role + KYC fields.

## Domain migration (Firestore → D1)

Two stages — run **after** the user ETL (orders/stores reference `user.id`):

```bash
# 1. dump Firestore to JSONL (needs Admin credentials)
GOOGLE_APPLICATION_CREDENTIALS=./sa.json \
  node --experimental-strip-types scripts/dump-firestore.ts ./firestore-dump

# 2. transform → D1 SQL (pure) and apply
node --experimental-strip-types scripts/etl-domain.ts ./firestore-dump > domain.sql
wrangler d1 execute nemtus-core-d1 --file=domain.sql --remote
```

Firestore stored no timestamps, so `created_at`/`updated_at` come from the document
`createTime`/`updateTime` metadata captured at dump time. Orders were denormalized (User+Store+Item in
one doc), so shipping + item name are snapshotted onto the order. The transform loads with foreign_keys
OFF and **reports orders that reference now-deleted items** — review that count before applying to
production.

> ⚠️ **The order model is now dual-rail (XYM + Stripe).** `etl-domain.ts` predates it — it maps legacy
> `orderStatus` onto the Stripe `payment_status` and keeps the XYM tx hash in `legacy_symbol_tx_hash`.
> Historical flea-market orders were XYM; before the real data migration, review whether legacy orders
> should instead populate the XYM fields (`payment_method='XYM'`, `order_status`, `symbol_tx_hash`).

## Storage migration (Firebase Storage → R2)

```bash
# copy all objects to R2 (preserves keys); needs Admin creds + R2 S3 creds
GOOGLE_APPLICATION_CREDENTIALS=./sa.json FIREBASE_STORAGE_BUCKET=symbol-fest-market.appspot.com \
R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... R2_BUCKET=nemtus-flea-market-r2 \
  node --experimental-strip-types scripts/copy-storage.ts
```

The domain ETL (`etl-domain.ts`) rewrites store/item image references from Firebase download URLs to
`/api/flea-market/files/<key>`, where `<key>` is the original Storage path (also the R2 key the copy
preserves). The Worker's `GET /api/flea-market/files/*` route serves them from R2, so no image data
lives in Firebase after cutover.

> ⚠️ Validate `firebaseScryptVerify` against a real exported hash before cutover.
