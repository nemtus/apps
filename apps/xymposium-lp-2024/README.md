# Symbol/NEM Community Xymposium 2024

Symbol/NEM Community Xymposium のイベント告知・登録サイト。Next.js (App Router) 製で、**Cloudflare Workers** 上で公開します。

## 技術スタック

| 領域           | 採用技術                                                                          |
| -------------- | --------------------------------------------------------------------------------- |
| フレームワーク | Next.js 16 (App Router) / React 19                                                |
| スタイリング   | Tailwind CSS v4 / shadcn/ui (Radix UI) / framer-motion                            |
| デプロイ       | Cloudflare Workers (`@opennextjs/cloudflare`)                                     |
| Lint / Format  | ESLint 9 (flat config) / Prettier                                                 |
| テスト         | Vitest (ユニット) / Storybook 10 (カタログ + インタラクション) / Playwright (E2E) |
| CI/CD          | GitHub Actions / Dependabot                                                       |

Node.js のバージョンは `.nvmrc` (Node 22) に固定しています。

## セットアップ

```bash
nvm use        # .nvmrc の Node を使用
npm ci
npm run dev    # http://localhost:3000
```

### 環境変数

| 変数              | 用途                                            |
| ----------------- | ----------------------------------------------- |
| `BASIC_AUTH_USER` | Basic 認証ユーザー名 (本番では未設定時バイパス) |
| `BASIC_AUTH_PASS` | Basic 認証パスワード                            |

ローカルは `.env` / `.dev.vars`、Cloudflare では `wrangler secret` で供給します。

## スクリプト

| コマンド                  | 内容                                               |
| ------------------------- | -------------------------------------------------- |
| `npm run dev`             | 開発サーバ                                         |
| `npm run build`           | 本番ビルド (Next.js)                               |
| `npm run lint`            | ESLint                                             |
| `npm run typecheck`       | `tsc --noEmit`                                     |
| `npm run knip`            | 未使用ファイル/エクスポート/依存の検出             |
| `npm run depcruise`       | 循環参照・依存境界違反の検出 (dependency-cruiser)  |
| `npm run format`          | Prettier で整形                                    |
| `npm run format:check`    | 整形チェック (CI 用)                               |
| `npm run test`            | Vitest (ユニット + Storybook コンポーネントテスト) |
| `npm run test:coverage`   | カバレッジ付きテスト                               |
| `npm run test:e2e`        | Playwright E2E                                     |
| `npm run storybook`       | Storybook 起動 (http://localhost:6006)             |
| `npm run build-storybook` | Storybook 静的ビルド                               |
| `npm run preview`         | Cloudflare Workers ローカルランタイムで確認        |
| `npm run deploy`          | Cloudflare Workers へデプロイ                      |

## Cloudflare Workers へのデプロイ

ローカル確認:

```bash
npm run preview
```

手動デプロイ (要 Cloudflare 認証情報):

```bash
npx wrangler login                        # 初回のみ
npx wrangler secret put BASIC_AUTH_USER   # 必要に応じて
npx wrangler secret put BASIC_AUTH_PASS
npm run deploy
```

### 自動デプロイ (Cloudflare Workers Builds / Git 連携)

本番デプロイは **Cloudflare 側の GitHub 連携 (Workers Builds)** で行う。GitHub Actions では
デプロイしない (このため deploy ワークフローは存在しない)。Cloudflare ダッシュボードで
リポジトリを接続し、ビルド/デプロイ設定を行うこと。

- ビルドコマンド: `npx opennextjs-cloudflare build`
- デプロイコマンド: `npx wrangler deploy`
- 認証情報・`BASIC_AUTH_USER` / `BASIC_AUTH_PASS` などの Secret は **Cloudflare 側**で設定する
  (GitHub Secrets ではない)。

## CI

`.github/workflows/ci.yml` が PR / push で以下を実行します。

1. `actions-pinned`: [pinact](https://github.com/suzuki-shunsuke/pinact) で GitHub Actions が全て
   full commit SHA に固定されているかを検証 (`pinact run --check`)。未固定があれば失敗する。
2. `quality`: audit (info 以上=level 問わず失敗) → format:check → lint → typecheck → knip (デッドコード) → dependency-cruiser (循環参照/境界) → build → build-storybook
3. `test`: Vitest (ユニット + Storybook ブラウザモード)
4. `e2e`: Playwright

依存更新は `.github/dependabot.yml` (npm / github-actions, 毎週) で自動 PR 化します。
SHA 固定された Actions も Dependabot が SHA + バージョンコメントごと更新する。

### GitHub Actions の SHA ピンニング

サプライチェーン対策として、ワークフロー内の Actions は**タグではなく full commit SHA** で固定する
(`uses: actions/checkout@<sha> # v4.x.x`)。タグは可変で乗っ取りリスクがあるため。

```bash
pinact run          # Actions を SHA に固定 (バージョンコメント付き)
pinact run --check  # 固定漏れがないか検証 (CI と同じ)
pinact run --verify # SHA とバージョンコメントの対応が正しいか検証
```

設定は `.pinact.yaml`。CI の `actions-pinned` ジョブが固定漏れを検出して失敗させる。

### サプライチェーン対策

`.npmrc` で以下を設定しています。

- `min-release-age=7` — 公開から 7 日未満の新しいバージョンはインストールしない (dependency cooldown / npm 11.10.0+)。直近に公開された悪意あるバージョンの取り込みを防ぐ。
- `save-exact=true` — 依存追加時に厳密バージョンで固定。

CI の `npm audit --audit-level=info` で、深刻度を問わず脆弱性が 1 件でもあれば失敗します。

## ライセンス

[MIT License](./LICENSE) — Copyright (c) 2024 NPO法人NEMTUS
