# nemtus/apps

NEMTUS web apps & sites monorepo (npm workspaces). Consolidates the hackathon app,
`flea-market` (formerly `symbol-fest-market`), and the hackathon landing pages, with a
shared auth / billing / data core being built out as part of an ongoing Firebase → Cloudflare
re-platform.

## Layout

```
apps/
  hackathon/            hackathon app (React 18 + Vite + Firebase + Symbol)
  flea-market/          marketplace, formerly symbol-fest-market (React 19 + Vite + Firebase + Symbol)
  hackathon-lp/         landing pages (static)
  hackathon-lp-2023..2025/
packages/               shared headless packages (db, auth, billing, email, storage) — WIP
```

## Getting started

Apps install **standalone** (each keeps its own lockfile) so React 18 (`hackathon`) and
React 19 (`flea-market`) stay isolated. Build an app from its own directory:

```bash
cd apps/flea-market && npm ci && npm run build
cd apps/hackathon   && npm ci && npm run dev
```

`apps/*/functions/` (Cloud Functions) are likewise standalone — `npm ci` and deploy from
inside each `functions/` directory.

Only shared `packages/*` are npm workspaces; run `npm install` at the repo root once those
exist (Phase 1).

## History & contributing

Each app under `apps/<name>/` retains the full git history of its original repository
(imported with `git filter-repo`). See [CLAUDE.md](CLAUDE.md) for conventions, the CI/CD
follow-up, and the migration roadmap.
