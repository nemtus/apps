/**
 * dependency-cruiser 設定
 * - 循環参照 / 未解決 import の検出
 * - アーキテクチャ境界 (UI ↔ ページ ↔ ユーティリティ) の維持
 * - サーバー専用エントリ (route.ts / middleware.ts) のクライアントへの混入防止
 * @type {import('dependency-cruiser').IConfiguration}
 */
const TEST_LIKE = "\\.(test|spec|stories)\\.[jt]sx?$";
const SERVER_ENTRY = "(^|/)(middleware|proxy)\\.ts$|(^|/)route\\.ts$";

module.exports = {
  forbidden: [
    {
      name: "no-circular",
      comment: "循環参照を禁止する",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "not-to-unresolvable",
      comment: "解決できない import (存在しないモジュール/パス) を禁止する",
      severity: "error",
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: "no-orphans",
      comment: "どこからも参照されない孤立モジュール (設定/型/テスト/ストーリーは除く)",
      severity: "warn",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts)$", // dotfiles (設定)
          "\\.d\\.ts$",
          "(^|/)(tailwind|postcss|next|vitest|playwright|knip)\\.config\\.[jt]s$",
          // Next.js のフレームワーク規約ファイル (フレームワークがロードするため import されない)
          "(^|/)(middleware|proxy)\\.ts$",
          "(^|/)(manifest|sitemap|robots|opengraph-image|twitter-image|icon|apple-icon)\\.tsx?$",
          TEST_LIKE,
        ],
      },
      to: {},
    },
    {
      name: "not-to-test",
      comment: "本番コードからテスト/ストーリーを import しない",
      severity: "error",
      from: { pathNot: TEST_LIKE },
      to: { path: TEST_LIKE },
    },
    {
      name: "components-not-to-app",
      comment: "再利用コンポーネントはページ層 (app/) に依存してはならない",
      severity: "error",
      from: { path: "^components/" },
      to: { path: "^app/" },
    },
    {
      name: "utilities-stay-pure",
      comment: "lib / hooks は UI やページ層に依存してはならない (リーフに保つ)",
      severity: "error",
      from: { path: "^(lib|hooks)/" },
      to: { path: "^(components|app)/" },
    },
    {
      name: "server-entry-not-imported",
      comment:
        "サーバー専用エントリ (route.ts / middleware.ts) を他モジュールから import しない (クライアント境界違反防止)。テストからの import は許可。",
      severity: "error",
      from: { pathNot: TEST_LIKE },
      to: { path: SERVER_ENTRY },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
    },
  },
};
