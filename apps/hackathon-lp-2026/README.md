# NEMTUS Hackathon 2026 Landing Page

## Requirements

- Node.js 20+
- pnpm

## Install

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Notes

- Created with v0
- Originally deployed on Vercel

## 依存関係の方針（重要）

**`pnpm.overrides` を追加しないでください。**

Dependabot は `pnpm-lock.yaml` を再生成する際、lockfile 先頭の `overrides:` ブロックを
書き出しません。そのため `pnpm.overrides` が1つでもあると、Dependabot の PR すべてが
インストール時点で落ちます。

```
ERR_PNPM_LOCKFILE_CONFIG_MISMATCH  Cannot proceed with the frozen installation.
The current "overrides" configuration doesn't match the value found in the lockfile
```

これは CI だけでなく Cloudflare Workers Builds のプレビューデプロイも落とすため、
「依存を最新に保つ」仕組みそのものが止まります。手で lockfile を直し続けるのは
現実的ではありません。

かつてここには 12 件の override がありましたが、次のように解消しました。

| 対象                 | 解消方法                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `motion-dom` の固定  | `framer-motion` を 14 系へ。14 は `motion-dom` を**厳密固定**で依存するため drift しない（12 系は `^` 指定だったため固定が必要だった）                                                       |
| `compression` の下限 | 供給元の `serve` を devDependency から外し、`preview` と Playwright の webServer で `npx --yes serve@14` を使う。`serve` は `compression@1.8.1` を厳密依存しており、他に上げる手段がなかった |
| 残り 10 件           | 実測の結果すべて無効（自然解決で既に下限を満たしていた）                                                                                                                                     |

**override が必要に思えたときは、まず原因のパッケージ自体を動かせないか検討してください。**
どうしても必要な場合は、Dependabot PR が毎回壊れることを承知のうえで、lockfile を
`pnpm install --no-frozen-lockfile` で再生成する運用を併せて用意してください。
