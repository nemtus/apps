import { defineConfig } from "vitest/config"

// Workspace-level tests for the shared packages/* and the backend apps/*/worker.
// Node environment: the code under test is pure logic (scrypt via @noble/hashes +
// WebCrypto, string helpers, Stripe param mapping) and node:sqlite schema checks —
// no Cloudflare Workers runtime is required.
//
// Convention: **unit** tests sit next to their source file (`src/<name>.test.ts`);
// **integration** tests that span a migration + schema live in a `test/` dir.
export default defineConfig({
  test: {
    environment: "node",
    include: [
      "packages/*/src/**/*.test.ts",
      "apps/*/worker/src/**/*.test.ts",
      "packages/*/test/**/*.test.ts",
      "apps/*/worker/test/**/*.test.ts",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/out/**"],
  },
})
