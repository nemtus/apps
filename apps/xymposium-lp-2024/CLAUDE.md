# AI エージェント向けガイド (CLAUDE.md)

このファイルは Claude Code 向けのプロジェクト指示書です。`AGENTS.md` (Codex) と `GEMINI.md` (Gemini)
はこのファイルへのシンボリックリンクであり、同じ内容を参照します。

## プロジェクト概要

Symbol/NEM Community Xymposium のイベント告知・登録サイト。**Next.js 16 (App Router) / React 19** 製で、
**Cloudflare Workers**（`@opennextjs/cloudflare`）にデプロイする。ほぼ静的（`force-static`）。

## 主要コマンド

| 目的         | コマンド                                          |
| ------------ | ------------------------------------------------- |
| 開発         | `npm run dev`                                     |
| 本番ビルド   | `npm run build`                                   |
| Lint         | `npm run lint` / 自動修正 `npm run lint:fix`      |
| 型チェック   | `npm run typecheck`                               |
| 整形         | `npm run format` / 確認 `npm run format:check`    |
| デッドコード | `npm run knip`                                    |
| 依存境界     | `npm run depcruise`                               |
| ユニット/SB  | `npm run test` (Vitest: unit + Storybook browser) |
| E2E          | `npm run test:e2e` (Playwright)                   |
| Storybook    | `npm run storybook` / `npm run build-storybook`   |
| Workers 確認 | `npm run preview` / デプロイ `npm run deploy`     |

## 作業完了前に必ず通すゲート (CI 相当)

コードを変更したら、以下を緑にしてから完了すること（CI が同じものを検証する）:

```
npm run format:check && npm run lint && npm run typecheck && \
npm run knip && npm run depcruise && npm run build && npm run test
```

E2E (`npm run test:e2e`) はサーバ起動を伴うため重い。主要な導線変更時のみローカル実行し、
基本は CI に任せる。これらは Claude Code の hooks (`.claude/settings.json`) でも自動実行される。

## アーキテクチャと規約

- **スタイル**: Tailwind CSS v4（**CSS-first**。設定は `app/globals.css` の `@theme` にあり、
  `tailwind.config.js` は存在しない）。shadcn/ui (Radix) + framer-motion。
- **Lint/Format**: ESLint 9 flat config (`eslint.config.mjs`) + Prettier。役割分担し競合させない。
  未使用変数は `_` プレフィックスで意図的未使用を表現できる。
- **依存境界**（`dependency-cruiser` が強制）:
  - `components/**` は `app/**`（ページ層）に依存しない。
  - `lib/**`・`hooks/**` はリーフ（UI/ページに依存しない）。
  - サーバー専用エントリ（`app/**/route.ts`・`middleware.ts`）を他モジュールから import しない。
- **テスト戦略**（役割で分離）:
  - ユニット (Vitest/jsdom): 純粋ロジック（`lib`・`hooks`・API バリデーション）。
  - Storybook: 全再利用コンポーネントのカタログ + 描画スモーク、挙動のあるものは `play` で操作検証。
  - E2E (Playwright): ページ横断のユーザー導線。

## 重要な制約（変更前に必読）

- **`middleware.ts` を `proxy.ts` にリネームしないこと**。Next 16 は `proxy.ts` を推奨し
  `next build` 時に非推奨警告を出す（`middleware.ts` があれば無条件に出る `warnOnce` で、
  Next.js 側に抑制フラグは存在しない）。しかし `proxy` は **Node ランタイム固定**
  （proxy では `runtime` 設定が throw する）で、デプロイ先の OpenNext (Cloudflare Workers) が
  Node ミドルウェアを未サポート。リネームするとデプロイビルドが
  `Node.js middleware is not currently supported` で `process.exit(1)` する。
  - OpenNext の判定 (`@opennextjs/cloudflare` の `dist/cli/build/utils/middleware.js`):
    **edge ミドルウェアなら OK、node ミドルウェアなら exit(1)**。現状の `middleware.ts` は
    ランタイム無指定＝edge のため通る。`proxy.ts` は Node 固定なので必ず落ちる。
  - **状況確認 (2026-06 時点 / Next 16.2.7・@opennextjs/cloudflare 1.19.11)**: issue #962 は
    CLOSED だが、Next16 対応の親 issue #972 では Proxy 対応は未完
    （"we only plan to support proxy with the Adapters API"）。OpenNext が proxy/Node
    ミドルウェアに対応するまではリネーム不可。対応されたら `proxy.ts` へ移行する。
  - 警告を今すぐ消したい場合の唯一の代替は、Next ミドルウェアを廃して Basic 認証を
    Cloudflare Worker 層（`.open-next/worker.js` をラップする独自エントリ）へ移すこと。
    v17 で `middleware.ts` が削除されてもこの方式なら影響を受けない（未採用）。
  - 追跡: https://github.com/opennextjs/opennextjs-cloudflare/issues/962 ,
    https://github.com/opennextjs/opennextjs-cloudflare/issues/972
- **画像は `next.config.mjs` で `images.unoptimized: true`**（Workers では Next 画像最適化が動かない）。
- **`cloudflare-env.d.ts`**（`wrangler types` 生成、gitignore 済）は workerd ランタイム型を含み
  DOM 型と衝突するため、`tsconfig.json` の `exclude` と ESLint ignore に入れてある。
- **GitHub Actions は full commit SHA で固定する**（タグ参照は不可）。`.github/workflows/` を編集したら
  `pinact run` で SHA 固定し、`pinact run --check` で検証する。CI の `actions-pinned` ジョブが
  固定漏れを検出して失敗させる。

## サプライチェーン対策

`.npmrc` で `min-release-age=7`（公開 7 日未満のバージョンは入れない cooldown）と
`save-exact=true` を設定。CI は `npm audit --audit-level=info` で深刻度を問わず失敗する。

## エージェント別の自動化サポート

このリポジトリは複数の AI コーディングエージェント向けに設定を用意している。

- **Claude Code** (`.claude/settings.json`):
  - hooks: `PostToolUse` で編集ファイルを Prettier 整形、`Stop` で CI 相当ゲート
    (`.claude/hooks/precheck.sh`: format:check/lint/typecheck/knip/depcruise/build/unit test) を実行し、
    失敗時はブロックして修正を促す。
  - permissions: 安全コマンドは allow、依存変更/push/deploy などは ask、危険コマンドや
    秘密ファイル読取は deny。
- **Codex CLI** (`.codex/config.toml`): 同等の `PostToolUse`/`Stop`/`PreToolUse` フックを定義
  (フックスクリプトは `.claude/hooks/` を共用)。`PreToolUse` は `.codex/hooks/policy.sh` で危険コマンドを拒否。
  `approval_policy = "on-request"`。プロジェクト層は trusted 時のみ有効。
- **Gemini CLI** (`.gemini/settings.json`): `contextFileName` で本ファイルを読み込み、`excludeTools` で
  危険コマンドを禁止。自動フックは未設定のため、**作業完了前に上記ゲートを手動実行**すること。

サポートの差により自動化されない場合でも、全エージェントは「作業完了前に必ず通すゲート」を守ること。

### MCP サーバー (リポジトリ同梱)

開発支援用の MCP サーバー設定を各エージェントの設定ファイルにコミットしてあり、リポジトリを
クローンすれば前提ツールを入れるだけで同じサーバーを使える（アプリ本体やデプロイには影響しない）。

- **対象サーバー**（4 つ）:
  - `serena`: セマンティックなコード検索/編集 (LSP)。設定は `.serena/project.yml`。起動に `uv`/`uvx` が必要。
  - `context7`: ライブラリ公式ドキュメント取得 (`@upstash/context7-mcp`)。API キーは任意（無しでも匿名動作）。
  - `playwright`: ブラウザ自動操作 (`@playwright/mcp`)。`npx playwright install` でブラウザ導入が必要。
  - `chrome-devtools`: Chrome DevTools 連携 (`chrome-devtools-mcp`)。Chrome/Chromium が必要。
- **設定ファイル**:
  - Claude Code: ルートの `.mcp.json`（VCS チェックイン前提の公式機能）。
  - Gemini CLI: `.gemini/settings.json` の `mcpServers`。
  - Codex CLI: `.codex/config.toml` の `[mcp_servers.*]`。
- **信頼/承認モデル**（クローン直後はいずれも明示承認が要る）:
  - Claude Code: 初回利用時に承認プロンプト。やり直すなら `claude mcp reset-project-choices`。
  - Gemini CLI: フォルダ信頼 (folder trust) を許可するまで project 設定ごと無視される。
  - Codex CLI: trusted プロジェクトでのみ project 層 MCP が読まれる。
    一部バージョン/クライアントでは project 層 MCP が読まれない既知問題 (openai/codex #13025, #13056) が
    あり、その場合は同じ `[mcp_servers.*]` を `~/.codex/config.toml` に置く。
- **秘密情報**: API キー等の実体はコミットしない。Context7 キーは環境変数で渡す
  （Claude=`${CONTEXT7_API_KEY:-}`、Gemini=`$CONTEXT7_API_KEY`、Codex=コミット設定からは省略し user 層へ）。

## Git / コミット

- 非対話環境では 1Password 署名が失敗するため、自動コミットは `git commit --no-gpg-sign` を使う。
- main へ直接コミットせず、ブランチを切って作業する。
