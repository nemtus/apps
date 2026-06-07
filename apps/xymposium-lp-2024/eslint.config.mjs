import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "public/**",
      "storybook-static/**",
      "coverage/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  // CommonJS な設定ファイルは require() を許可する
  {
    files: ["*.config.js", "*.config.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // フォーマットに関わる ESLint ルールを無効化し Prettier と競合させない（必ず最後に展開）
  eslintConfigPrettier,
];

export default config;
