# CLAUDE.md

このリポジトリで作業する際の Claude Code 向けガイドです。

## プロジェクト概要

NEMTUS ハッカソン用の Web アプリケーション。React + Firebase + Symbol ブロックチェーンのテンプレートをベースにしている。

- **フロントエンド**（リポジトリルート）: React 18 + Vite + TypeScript + TailwindCSS / daisyUI
- **バックエンド**（`functions/`）: Firebase Cloud Functions（TypeScript）。詳細は [functions/CLAUDE.md](functions/CLAUDE.md) を参照
- **インフラ**: Firebase（Authentication / Firestore / Storage / Functions / Hosting）
- **ブロックチェーン**: Symbol SDK

> 注: `README.md` には Create React App と書かれているが、実体は **Vite** ベース。README は古いので CLAUDE.md を正とする。

## モノレポ構成

```
.                     # フロントエンド（Vite/React）パッケージ
├── src/              # React アプリ本体（components / models / utils / images）
├── public/           # 静的アセット
├── functions/        # Firebase Functions（独立した package.json / tsconfig / eslint）
├── firebase.json     # Firebase サービス設定（hosting / functions / emulators など）
├── firestore.rules   # Firestore セキュリティルール
├── firestore.indexes.json
├── storage.rules     # Storage セキュリティルール
└── .firebaserc       # Firebase プロジェクトのエイリアス
```

ルートと `functions/` は **別パッケージ**。依存もコマンドも独立しているため、`functions/` を触るときは `cd functions` してから作業する。

## 主要コマンド（ルート）

```bash
npm run dev         # 開発サーバ起動（Vite）
npm run lint        # ESLint（src/**/*.{js,jsx,ts,tsx}）
npm run format      # Prettier で全体整形
npm run typecheck   # tsc --noEmit（型チェックのみ）
npm run build       # 型チェック + 本番ビルド（dist 出力）
npm run build:testnet   # testnet モードでビルド
npm run build:mainnet   # mainnet モードでビルド
npm run preview     # ビルド結果のプレビュー
```

## 規約

- **Node**: このアプリは Node 26（`.nvmrc`）。`functions/` は Node 22（`engines.node`）で
  固定。これは選択ではなく制約で、`engines.node` が Cloud Functions のランタイムを決め、
  Firebase は `nodejs18/20/22` しか提供していないため上げられない
- **整形**: Prettier（`singleQuote: true`、`printWidth: 80`、`semi: true`、`tabWidth: 2`、`endOfLine: lf`）
- **Lint**: ESLint（`eslint:recommended` + React + `@typescript-eslint`）
- **npm**（`.npmrc`）:
  - `ignore-scripts=true` — 依存のライフサイクルスクリプトを無効化（サプライチェーン対策）。ネイティブビルドが必要な依存は `npm rebuild <pkg>` で明示的に実行する
  - `save-exact=true` — 新規依存はバージョン固定で追加される
  - `audit-level=high` — 監査閾値は high

## セキュリティ（重要）

- `.env` 系ファイル（`.env` / `.env.mainnet` / `.env.testnet` / `*.encoded` / `*.decoded`）には**秘密情報が含まれる**。**絶対にコミット・標準出力・チャットへ出力しない**（`.gitignore` 済み）。これらは Claude Code の権限設定で読み取りを deny している
- 環境変数は base64 で encode/decode して受け渡す運用:
  ```bash
  npm run encode-env --from=.env --to=.env.encoded
  npm run decode-env --from=.env.encoded --to=.env
  ```
- Firebase の `firestore.rules` / `storage.rules` を変更したら、セキュリティ上の影響を必ず確認する

## CI

CI はモノレポのルート（`<repo-root>/.github/workflows/`）に移設済み。**このディレクトリ配下の
`.github/workflows/` は実行されない**（GitHub はルートの `.github/workflows/` のみ実行する）。

- `ci-hackathon.yml` — このアプリ: `npm audit`（gate は `critical`）→ `npm ci` → `lint` →
  `typecheck` → `build`。Node 26（`.nvmrc`）
- `ci-hackathon-functions.yml` — `functions/`: `npm audit`（`high`）→ `npm ci` →
  `format:check` → `lint` → `build`。Node 22（`functions/.nvmrc`）
- 配下に残る `ci-react.yml` / `ci-functions.yml` は上記で置き換え済みの不活性コピー。
  `cd-firebase-*.yml` は WIF の信頼設定をこのリポジトリへ張り替えるまで不活性のまま
- コミット前に `npm run typecheck` / `npm run build` が通ることを確認する

## CD（デプロイ）

- `.github/workflows/cd-firebase-testnet.yml` — main への push / 手動実行で testnet（`nemtus-hackathon-test`）へデプロイ
- `.github/workflows/cd-firebase-mainnet.yml` — 手動実行（`workflow_dispatch`）で mainnet（`nemtus-hackathon`）へデプロイ
- **認証は OIDC + Workload Identity Federation（キーレス）**。`google-github-actions/auth` で GCP のデプロイ用サービスアカウントを impersonation し、firebase CLI は ADC（`GOOGLE_APPLICATION_CREDENTIALS`）経由でデプロイする。長期 `FIREBASE_TOKEN` は使わない
- GitHub Environment（`testnet` / `mainnet`）の Variables に `WIF_PROVIDER` / `DEPLOY_SERVICE_ACCOUNT` / `GCP_PROJECT_ID` を設定する。GCP 側の WIF プール・SA 設定手順は移行計画を参照
- ワークフローの permissions に `id-token: write` が必須（OIDC トークン取得のため）
