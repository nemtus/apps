# nemtus/apps

NEMTUS web apps & sites monorepo (npm workspaces). Consolidates the **HACK+ hackathon app**,
`flea-market` (formerly `symbol-fest-market`), the **HACK+ landing pages**, and the
**XYMPOSIUM** community-conference sites — plus a shared, headless **auth / billing / data**
core. It is also the vehicle for an in-progress **re-platform off Firebase onto Cloudflare**
(Workers + D1 + KV + R2), **Better Auth**, **AWS SES**, and **Stripe**. Until an app is
migrated it keeps running on its existing Firebase project; the monorepo currently shares
**code and tooling, not Firebase projects**.

## Layout

```
apps/
  hackathon/            HACK+ hackathon app. React 18 + Vite + Firebase + Symbol SDK. Own functions/.
  flea-market/          Marketplace, formerly symbol-fest-market. React 19 + Vite + Firebase +
                        Symbol. Own functions/ (Firebase) + worker/ (new Cloudflare backend).
  hackathon-lp/         HACK+ index/aggregator site (static, Cloudflare Worker).
  hackathon-lp-2023/    HACK+ per-year event sites — static sites served as Cloudflare Workers
  hackathon-lp-2024/    (each with its own wrangler.toml), deployed via Cloudflare Workers Builds.
  hackathon-lp-2025/
  hackathon-lp-2026/    (Next.js + pnpm).
  xymposium-lp/         XYMPOSIUM redirect aggregator — a `main` Worker (`/` → latest year).
  xymposium-lp-2024/    XYMPOSIUM 2024 site (Next.js / OpenNext server Worker on Cloudflare).
  xymposium-lp-2025/    XYMPOSIUM 2025 site (static, Cloudflare Worker).
packages/               Shared, headless npm-workspace packages (run on Cloudflare Workers):
  db/                   Drizzle schema (Better Auth + KYC/admin) + D1 client
  auth/                 Better Auth (D1 + KV), Firebase-scrypt lazy re-hash, social/KYC/admin
  email/                AWS SES via aws4fetch (SigV4)
  storage/              R2 helpers with auth-checked, per-user access
  billing/              Stripe Checkout + webhook verification
  config/               shared Prettier preset + tsconfig base
```

## Getting started

`apps/*` install **standalone** — each keeps its own `package-lock.json`, so React 18
(`hackathon`) and React 19 (`flea-market`) stay isolated. Build an app from its own directory:

```bash
cd apps/flea-market && npm ci && npm run build
cd apps/hackathon   && npm ci && npm run dev
```

`apps/*/functions/` (Firebase Cloud Functions) install standalone too. The shared `packages/*`
and the Cloudflare backend `apps/*/worker` are the only npm **workspaces** — run `npm install`
at the repo root to work on those.

## Deploys

- **Landing / event sites** (`hackathon-lp*`, `xymposium-lp*`) deploy through **Cloudflare
  Workers Builds** (Git-connected via the Cloudflare GitHub App — no token stored in GitHub).
  `main` → production, PRs → preview URLs. Each site's repo artifact is its
  `wrangler.toml` / `wrangler.jsonc`.
- **Firebase apps** (`hackathon`, `flea-market`) still deploy to their existing Firebase
  projects; re-establishing their deploy pipelines is a tracked follow-up.
- Checks-only CI runs per app in GitHub Actions (path-filtered, Socket-hardened installs).

## Roadmap

Phased Firebase → Cloudflare migration: **Phase 0** monorepo foundation (done) → **Phase 1**
shared Cloudflare packages → **Phase 2** pilot (`flea-market`) → **Phase 3** `hackathon` →
**Phase 4** LP sites → **Phase 5** decommission Firebase. Auth migrates via Better Auth on
Workers × D1 with **lazy scrypt re-hash** (existing Firebase passwords keep working).

## History & contributing

Each app under `apps/<name>/` retains the full git history of its original repository (imported
with `git filter-repo`), so `git log --follow` and `git blame` work across the move. See
[CLAUDE.md](CLAUDE.md) for conventions, the full CI/CD model, per-app details, the migration
roadmap, and the source-repo mapping.
