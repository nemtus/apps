/**
 * Bindings + secrets for the flea-market auth Worker. Bindings come from
 * wrangler.toml; secrets via `wrangler secret put`; non-secret vars via [vars].
 */
export interface Env {
  // --- Cloudflare bindings ---
  DB: D1Database;
  /** Shared NEMTUS core: Better Auth sessions (cross-app). Title: nemtus-core-session-kv. */
  SESSION_KV: KVNamespace;
  /** flea-market app-scoped ephemera: XYM price cache + store-email codes. Title: nemtus-flea-market-kv. */
  APP_KV: KVNamespace;
  BUCKET: R2Bucket;

  // --- core auth config ---
  BETTER_AUTH_SECRET: string;
  AUTH_BASE_URL: string;
  /** comma-separated extra trusted origins (SPA origins) */
  TRUSTED_ORIGINS?: string;

  // --- Firebase hash_config (for lazy password re-hash) ---
  FIREBASE_SIGNER_KEY: string;
  FIREBASE_SALT_SEPARATOR: string;
  FIREBASE_ROUNDS?: string;
  FIREBASE_MEM_COST?: string;

  // --- social providers (optional; enabled only when both id+secret present) ---
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  TWITTER_CLIENT_ID?: string;
  TWITTER_CLIENT_SECRET?: string;
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  APPLE_CLIENT_ID?: string;
  APPLE_CLIENT_SECRET?: string;

  // --- AWS SES ---
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  SES_FROM: string;
  /** Optional SES configuration set (per-environment tracking/suppression), e.g. flea-market / flea-market-test / flea-market-dev. */
  AWS_SES_CONFIGURATION_SET?: string;

  // --- Stripe ---
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  CHECKOUT_SUCCESS_URL: string;
  CHECKOUT_CANCEL_URL: string;

  // --- XYM/JPY price (optional) ---
  /** CoinMarketCap Pro API key; enables the CMC fallback for the XYM/JPY rate. */
  COINMARKETCAP_API_KEY?: string;

  // --- Symbol (XYM order settlement verification; required for the XYM rail) ---
  /** Symbol node REST base URL, e.g. https://node.example.com:3001 (no trailing slash). */
  SYMBOL_NODE_URL?: string;
  /** Network currency mosaic id (hex), e.g. mainnet 6BED913FA20223F8. Per-network. */
  SYMBOL_CURRENCY_MOSAIC_ID?: string;

  // --- feature flags (optional [vars]; enabled unless explicitly "false") ---
  ENABLE_CREATE_USER?: string;
  ENABLE_CREATE_STORE?: string;
  ENABLE_CREATE_ITEM?: string;
  ENABLE_CREATE_ORDER?: string;

  // --- store KYC steps (opt-IN: required only when explicitly "true") ---
  /** Require store phone verification (Twilio, once integrated). Default off = skipped. */
  ENABLE_STORE_PHONE_VERIFICATION?: string;
  /** Require store address verification (postal SaaS, once integrated). Default off = skipped. */
  ENABLE_STORE_ADDRESS_VERIFICATION?: string;
}
