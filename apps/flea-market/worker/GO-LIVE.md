# flea-market — go-live runbook

The flea-market Firebase → Cloudflare **code migration is complete** (auth = Better Auth, data =
domain API on D1, payments = XYM + Stripe dual-rail, KYC = Better Auth + SES email challenge, no
Firebase in the frontend, CI green). What remains is **provisioning + credentialed smoke tests +
cutover** — the operational steps below. Nothing here needs code changes.

Run the `wrangler` steps from `apps/flea-market/worker/`. Requires `wrangler login` (Cloudflare
account) with D1/KV/R2 enabled.

---

## 0. External-API assumptions — already validated (live, mainnet)

These were coded best-effort and are now confirmed against live endpoints (no action needed, kept
here as the record):

- **Price** (`src/lib/price.ts`): Zaif `/api/1/ticker/xym_jpy` → `last`; bitbank `/xym_jpy/ticker` →
  `data.last` (string); CoinGecko `/simple/price?ids=symbol&vs_currencies=jpy` → `symbol.jpy`.
- **Symbol REST** (`src/lib/symbol.ts`, `verifyXymTransfer`):
  `/transactions/confirmed?recipientAddress=<BASE32>&type=16724&order=desc&pageSize=100` — the search
  param takes the **base32** address (the `T…`/`N…` form stored as `store.symbolAddress`); hex returns
  nothing. Response shape `data[].meta.hash` + `data[].transaction.mosaics[{id,amount}]` +
  `data[].transaction.message` (hex with a `00` plain-message marker) all match.
- **Mainnet currency mosaic id** = `6BED913FA20223F8` (from `/network/properties`
  `chain.currencyMosaicId`, normalized). Testnet's differs — read it from that network's node.

Still needs credentials to verify (see §5): Firebase-scrypt vs a real export, SES send, Stripe webhook.

---

## 1. Provision Cloudflare resources → fill `wrangler.toml`

```bash
# D1 (shared NEMTUS core DB) → copy database_id into wrangler.toml (TODO_D1_DATABASE_ID)
wrangler d1 create nemtus-core-d1

# KV — two namespaces: SESSION_KV (shared Better Auth sessions) + APP_KV (XYM price
# cache + store-email codes). Put each id into the matching binding in wrangler.toml.
wrangler kv namespace create nemtus-core-session-kv
wrangler kv namespace create nemtus-flea-market-kv

# R2 (store/item images)
wrangler r2 bucket create nemtus-flea-market-r2
```

Then edit `wrangler.toml`: fill each binding's id from the create output (D1 `database_id`, the two
KV ids for `SESSION_KV` / `APP_KV`), and set
`[vars] AUTH_BASE_URL` to the deployed Worker origin (e.g. `https://nemtus-flea-market-api.<subdomain>.workers.dev`
or the custom domain).

## 2. Apply migrations

```bash
wrangler d1 migrations apply nemtus-core-d1 --remote
```

## 3. Set secrets + vars

**Secrets** (`wrangler secret put <NAME>`):

| Secret | What / where |
| --- | --- |
| `BETTER_AUTH_SECRET` | 32+ random bytes. **Must be identical across all NEMTUS apps** sharing the core session (cross-subdomain SSO). |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM user with `ses:SendEmail`. |
| `STRIPE_SECRET_KEY` | Stripe → API keys (live). |
| `STRIPE_WEBHOOK_SECRET` | Stripe → the webhook endpoint's signing secret (create the endpoint at `<AUTH_BASE_URL>/api/flea-market/stripe/webhook`). |
| `FIREBASE_SIGNER_KEY` / `FIREBASE_SALT_SEPARATOR` / (optional) `FIREBASE_ROUNDS` / `FIREBASE_MEM_COST` | source project's password `hash_config` (Firebase console → Authentication → ⋮ → password hash parameters), for lazy scrypt re-hash of migrated passwords. `ROUNDS`/`MEM_COST` are non-secret tuning params but kept as secrets so all `FIREBASE_*` live in one place; set them only if they differ from the code defaults (8 / 14). Per-project value — testnet (`symbol-fest-market-test`) differs from mainnet (`symbol-fest-market`). |
| `COINMARKETCAP_API_KEY` | optional — enables the CMC price fallback. |
| `GOOGLE_/GITHUB_/TWITTER_/MICROSOFT_/APPLE_CLIENT_ID`+`_SECRET` | optional — each provider is enabled only when both id+secret are present. |

**Vars** (`[vars]` in `wrangler.toml`, non-secret):

| Var | Value |
| --- | --- |
| `AUTH_BASE_URL` | the Worker origin (see §1). |
| `TRUSTED_ORIGINS` | comma-separated SPA origins (the flea-market site origin(s)). |
| `AWS_REGION` | e.g. `ap-northeast-1`. |
| `AWS_SES_FROM` | a verified SES identity, e.g. `NEMTUS <no-reply@nemtus.com>`. |
| `CHECKOUT_SUCCESS_URL` / `CHECKOUT_CANCEL_URL` | SPA return URLs for Stripe Checkout. |
| `SYMBOL_NODE_URL` | a reliable Symbol REST node, e.g. `https://sym-main-01.opening-line.jp:3001` (no trailing slash). **Required for the XYM rail.** |
| `SYMBOL_CURRENCY_MOSAIC_ID` | `6BED913FA20223F8` (mainnet). **Required for the XYM rail.** |
| `ENABLE_CREATE_USER/STORE/ITEM/ORDER` | optional; enabled unless set to `"false"`. |
| `ENABLE_STORE_PHONE_VERIFICATION` / `ENABLE_STORE_ADDRESS_VERIFICATION` | leave **unset/`false`** (skipped) until Twilio / postal-mail integrations land; set `"true"` to require them. |

Also verify SES is **out of the sandbox** (production sending) and the From identity/domain is verified.

## 4. ETL the legacy data (D1 + R2)

Run the worker's ETL scripts (`src/scripts/etl-users.ts`, `etl-domain.ts`, `dump-firestore.ts`) against
a `firebase auth:export` + a Firestore dump, loading users/profiles/stores/items/orders into D1 and
images into R2. See the scripts for their expected input files.

## 5. Credentialed smoke tests (before cutover)

- **Firebase-scrypt**: verify `firebaseScryptVerify` reproduces a hash from a **real** `auth:export`
  row (the unit test proves the algorithm against a canonical vector; this confirms *your project's*
  `hash_config`). A wrong signer key = every migrated login fails.
- **SES**: trigger a Better Auth verification email + the store-email challenge; confirm delivery.
- **Stripe**: run a test Checkout end-to-end; confirm the webhook flips the order to `PAID`.
- **XYM** (end-to-end): create a XYM order, pay the shown amount to the store address with the orderId
  message, confirm the order-detail poll advances it to `CONFIRMED` (the REST shapes are already
  validated in §0, so this exercises the wiring + your chosen `SYMBOL_NODE_URL`).

## 6. Cutover

Point the flea-market DNS at the Cloudflare deployment (same Vercel→Cloudflare pattern used for
hackathon-2026). Keep the old Firebase project warm until the new stack is confirmed, then decommission
Firebase: `apps/flea-market/functions`, `firebase-tools`, `firebase.json`, `firestore.rules`.
