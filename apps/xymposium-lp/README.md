# xymposium-lp

The **XYMPOSIUM** multi-year redirect aggregator, served at
[`xymposium.nemtus.com`](https://xymposium.nemtus.com) on Cloudflare Workers.

It is a stable entry point that forwards to the per-year event sites:

| Path | Redirects to | Status |
| --- | --- | --- |
| `/` (and any unknown path) | latest year (`xymposium-2025.nemtus.com`) | `302` temporary |
| `/2024[/…]` | `xymposium-2024.nemtus.com` | `301` permanent |
| `/2025[/…]` | `xymposium-2025.nemtus.com` | `301` permanent |

Sub-paths and query strings are preserved (e.g. `/2024/terms` → `…/terms`).

## Adding a new year

Edit `src/index.ts`:

1. Add the new year to the `YEARS` map (e.g. `"2026": "https://xymposium-2026.nemtus.com"`).
2. Bump `LATEST_YEAR` to that year so `/` points at it.

That is the only file to change.

## Local development

```bash
npx wrangler dev
# then, in another shell:
curl -sI localhost:8787/       # 302 -> latest year
curl -sI localhost:8787/2024   # 301 -> xymposium-2024.nemtus.com
```

## Deployment

Deployed by **Cloudflare Workers Builds** (Git-connected), not GitHub Actions. See
`wrangler.toml` for the dashboard settings. `main` merges publish to production; PRs get
preview URLs.
