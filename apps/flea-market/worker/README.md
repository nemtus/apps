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
- `POST /api/stripe/webhook` — verifies the signature and advances the D1 order
  (`checkout.session.completed → PAID`, `async_payment_failed → FAILED`,
  `charge.refunded → REFUNDED`). Bypasses auth; uses the raw body.

Lazy Firebase password migration and the rehash-on-login hook are handled inside
`@nemtus/auth`; this Worker supplies bindings + config. The D1 schema is the
combined auth (`@nemtus/db`) + flea-market domain (`store`/`item`/`order`) set,
generated here (`npm run db:generate`, `migrations_dir → migrations`).

## Provisioning (fill the `TODO_*` ids in wrangler.toml)

```bash
wrangler d1 create flea-market
wrangler kv namespace create SESSION_KV
wrangler r2 bucket create flea-market

# apply the shared auth schema to D1:
wrangler d1 migrations apply DB --remote      # migrations_dir → packages/db/migrations

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
wrangler d1 execute flea-market --file=users.sql --remote
```

Preserves the Firebase uid as `user.id`; credential users import with a
`firebase-scrypt$…` marker (verified + lazily re-hashed on first login); federated
identities become per-provider `account` rows; custom claims → admin role + KYC fields.

> ⚠️ Validate `firebaseScryptVerify` against a real exported hash before cutover.
