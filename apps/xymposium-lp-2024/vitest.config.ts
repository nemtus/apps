import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// `@/*` を tsconfig の paths と揃える (プロジェクトルート)
const rootDir = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    // jsdom 環境のユニットテスト。
    // Storybook のコンポーネントテストは .storybook 側の vitest project として
    // 別途追加される (Step: Storybook)。
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: ["**/*.{test,spec}.{ts,tsx}"],
          exclude: ["**/node_modules/**", "**/.next/**", "**/.open-next/**", "e2e/**", "**/*.stories.*"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**", "hooks/**", "app/**/api/**"],
    },
  },
});
