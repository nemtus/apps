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

デプロイ (要 Cloudflare 認証情報):

```bash
npx wrangler login                        # 初回のみ
npx wrangler secret put BASIC_AUTH_USER   # 必要に応じて
npx wrangler secret put BASIC_AUTH_PASS
npm run deploy
```

### GitHub Actions による自動デプロイ

`main` への push で `.github/workflows/deploy.yml` が実行されます。以下のリポジトリ Secret が必要です。

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## CI

`.github/workflows/ci.yml` が PR / push で以下を実行します。

1. `quality`: audit (high 以上で失敗) → format:check → lint → typecheck → knip (デッドコード) → dependency-cruiser (循環参照/境界) → build → build-storybook
2. `test`: Vitest (ユニット + Storybook ブラウザモード)
3. `e2e`: Playwright

依存更新は `.github/dependabot.yml` (npm / github-actions, 毎週) で自動 PR 化します。
