import { defineConfig } from 'drizzle-kit';

/**
 * Generates SQL migrations into ./migrations from the Drizzle schema.
 *   npm run db:generate           # write migration SQL
 *   wrangler d1 migrations apply <BINDING> --local|--remote   # apply (from an app)
 *
 * D1 is SQLite. Migrations are applied via wrangler from the consuming app's
 * context (the app owns the D1 binding in its wrangler.toml), not from here.
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema/index.ts',
  out: './migrations',
});
