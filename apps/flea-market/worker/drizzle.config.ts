import { defineConfig } from 'drizzle-kit';

/**
 * Generates the combined (auth + domain) migration set for flea-market's D1 into
 * ./migrations. Apply with `wrangler d1 migrations apply DB --local|--remote`
 * (wrangler.toml migrations_dir → ./migrations).
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema/index.ts',
  out: './migrations',
});
