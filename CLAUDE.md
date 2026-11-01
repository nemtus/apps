# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other coding agents when
working in this repository.

## Project overview

`nemtus/apps` is an **npm-workspaces monorepo** that consolidates NEMTUS's web apps and
landing sites, plus (over time) a shared **auth / billing / data** core. It was created by
consolidating six formerly separate repositories, **preserving each one's full git history**
under `apps/<name>/` (see [History](#history)).

The monorepo is also the vehicle for an in-progress **re-platform off Firebase onto
Cloudflare** (Workers + D1 + KV + R2), **Better Auth**, **AWS SES**, and **Stripe**. See the
approved migration plan referenced in [Roadmap](#roadmap). Until an app is migrated it keeps
running on its **existing, unchanged Firebase project** — the monorepo currently shares
**code and tooling, not Firebase projects**.

## Layout

```
apps/
  hackathon/            React 18 + Vite + Tailwind/daisyUI + Firebase + Symbol SDK v2.
                        Social OAuth (Google/Twitter/GitHub/Yahoo/MS/Apple). Own functions/.
  flea-market/          (formerly symbol-fest-market) React 19 + Vite + MUI + Firebase +
                        @nemtus/symbol-sdk-typescript v3. Email/password + KYC custom claims.
                        XYM order settlement. Own functions/.
  hackathon-lp/         Static aggregator/index site (public/ only, no build).
  hackathon-lp-2023/    Static per-year event sites (public/ only, no build).
  hackathon-lp-2024/    Each hosts as an assets-only Cloudflare Worker (serves public/) via
  hackathon-lp-2025/    its own wrangler.toml; deployed by Cloudflare Workers Builds (Git).
  xymposium-lp/         XYMPOSIUM redirect aggregator (xymposium.nemtus.com). NOT assets-only:
                        a `main` Worker (src/index.ts) — 302 `/`→latest year, 301 `/<year>`→
                        that year's site. Add a year = one edit to src/index.ts.
  xymposium-lp-2024/    XYMPOSIUM 2024 site. Next.js 16 + React 19 on Cloudflare Workers via
                        @opennextjs/cloudflare (a *server* Worker, not static export). Own
                        CLAUDE.md + tooling; optional Basic auth via middleware.ts.
  xymposium-lp-2025/    XYMPOSIUM 2025 site. Static (public/ only, no build); root index.html
                        meta-refreshes to /2025/. Assets-only Worker like the hackathon-lp*.
  stir-hosyu-lp/        Stir Hosyu Symbol LP (stir-hosyu.nemtus.com) — the Symbol node
                        maintenance service being taken over by NEMTUS. Hand-written
                        HTML + one CSS file, no JS. Assets-only Worker. Three links
                        (Google Form, privacy policy, terms) are placeholders until their
                        URLs exist — `grep TODO:SET-URL public/index.html`.
    flea-market/worker/ flea-market backend Worker (Better Auth on D1+KV, Stripe,
                        /api/orders, /api/files). Workspace via the apps/*/worker glob.
packages/               Shared, headless npm-workspace packages (Cloudflare Workers):
  db/                   Drizzle schema (Better Auth tables + KYC/admin fields) + D1 client
  auth/                 Better Auth (D1 + KV sessions), Firebase-scrypt lazy re-hash,
                        social providers, KYC/admin, SES email hooks
  email/                AWS SES via aws4fetch (SigV4)
  storage/              R2 helpers with auth-checked, per-user access
  billing/              Stripe Checkout + webhook verification (replaces XYM settlement)
  config/               shared Prettier preset (TS base = repo-root tsconfig.base.json)
```

## Conventions

- **Package manager: npm. Workspaces are scoped to `packages/*` only** (the shared, headless
  packages). **`apps/*` install standalone** — each app keeps its own `package.json` +
  `package-lock.json` and is built with `npm ci && npm run build` from inside its own
  directory. This deliberately isolates **React 18 (`hackathon`) from React 19
  (`flea-market`)**: hoisting them into one install makes the shared `react-router-dom`
  resolve one React major's types and breaks the other app's `tsc`. Revisit (fold `apps/*`
  into the workspace) when `hackathon` moves to React 19 during its Phase 3 migration.
- **`apps/*/functions/` are also standalone.** Each Cloud Functions package keeps its own
  `package.json` + `package-lock.json` and is installed/deployed independently by Firebase
  (`npm ci` inside `functions/`).
- **Per-app config is authoritative.** Each app keeps its own `firebase.json` / `.firebaserc`,
  `tsconfig.json`, `vite.config.ts`, ESLint, and Prettier config (they differ: e.g. Prettier
  `printWidth` 80 in `hackathon` vs 120 in `flea-market`; React 18 vs 19). Read the app's own
  `CLAUDE.md` where present — it is authoritative for that app.
- **Supply-chain hardening** (root `.npmrc`): `ignore-scripts=true`, `save-exact=true`,
  `audit-level=high`. Run `npm rebuild <pkg>` if a dependency legitimately needs a native build.
- **Write published artifacts in English** — PR titles/descriptions, commit messages, code
  comments, docs, release notes. Conversational replies may be in the user's language.
- **Pin every GitHub Actions `uses:` to a full commit SHA** (with a `# vX.Y.Z` comment);
  mutable tags are rejected by `pinact`.

## CI/CD status

**LP sites → Cloudflare Workers Builds (Git-connected, no GitHub Actions).** The four
`hackathon-lp*` sites deploy through **Cloudflare Workers Builds** connected to this repo via
the Cloudflare GitHub App — deliberately *not* GitHub Actions, so no Cloudflare token is stored
in GitHub. Each site is a separate Worker in the Cloudflare dashboard pointed at its
subdirectory (Root directory `apps/<site>`, Build watch paths `apps/<site>/*`, Deploy command
`npx wrangler deploy`, production branch `main`). `main` merge → production `*.workers.dev`;
PRs → preview URLs (commented on the PR by Cloudflare). Settings live in the Cloudflare
dashboard; the repo artifact is each site's `wrangler.toml`.

The `xymposium-lp*` sites use the same Workers Builds model, with two shapes that differ from
the assets-only default: **`xymposium-lp-2024`** is a Next.js/OpenNext *server* Worker — its
Build command is `npm run cf:build` (= `opennextjs-cloudflare build`, emits
`.open-next/worker.js`; an SSR worker inherently needs a build step, so this is the one command
that can't be dropped), Deploy stays the uniform `npx wrangler deploy`, config in
`wrangler.jsonc`. **`xymposium-lp`** (the redirect aggregator)
has no build but ships a `main` Worker script (`src/index.ts`, bundled by wrangler on deploy).
`xymposium-lp-2025` is a plain assets-only static site like the `hackathon-lp*`.

**Checks CI → GitHub Actions (repo-root, path-filtered, token-free Socket).** Every package
gets a **checks-only** workflow at `.github/workflows/ci-<name>.yml` (deploys stay on Workers
Builds). Each is path-filtered to its package, pins every `uses:` to a full commit SHA, and
hardens installs with **Socket Firewall Free** (`SocketDev/action`, `mode: firewall-free`) so
`sfw npm ci` / `sfw pnpm install` blocks confirmed-malicious packages at fetch time — no Socket
token/account. This complements the repo-root `socket.yml` (Socket GitHub App: PR
dependency-risk comments) and `.npmrc` (`ignore-scripts`, `save-exact`). **Only the repo-root
`.github/workflows/` runs** — anything under `apps/*/.github/workflows/` is inert, so a gap
there is silent. The full set:

| Workflow | Covers | Audit gate |
| --- | --- | --- |
| `ci-core` | `packages/*` + `apps/*/worker` | `high`, all deps |
| `ci-flea-market` | the React 19 SPA (excludes `worker/`) | `high`, `--omit=dev` |
| `ci-flea-market-functions` | `apps/flea-market/functions` (install + `tsc`; no lint script) | `high` |
| `ci-hackathon` | the React 18 SPA (excludes `functions/`) | `critical` — see below |
| `ci-hackathon-functions` | `apps/hackathon/functions` | `high` |
| `ci-hackathon-lp-2026` | pnpm/Next | `high` (`pnpm audit`) |
| `ci-xymposium-lp-2024` | npm/Next: quality + vitest + Playwright e2e | `high`, `--omit=dev` |
| `ci-xymposium-lp` | aggregator: `npm ci` → typecheck → `wrangler deploy --dry-run` | `high` |
| `ci-static-sites` | the 6 assets-only sites: asserts they are still dependency-free, then `wrangler deploy --dry-run` per site | n/a (no deps) |
| `pinact` | SHA-pinning of every `uses:` | n/a |

Two gates are deliberately not `high`. `ci-hackathon` sits at `critical` because `firebase` →
`@firebase/firestore` pins `@grpc/grpc-js` at `~1.9.0` (still true in firebase 13), giving four
highs with no version to move to; grpc-js never reaches the browser bundle, which goes through
`@firebase/webchannel-wrapper`. Tighten it once the Firebase SDK moves on. `ci-static-sites` has
no gate because those packages have no dependencies — it asserts that instead, and fails if one
ever grows a dependency without getting a real checks workflow.

When adding a Socket-wrapped workflow, reuse the SHAs already pinned in these files.

**Node versions.** CI runs **Node 26** (the LTS line, "Lithium") everywhere except the two
`functions/` packages, which are pinned to **22** by `engines.node`. That pin is not a free
choice: the field selects the Cloud Functions runtime and Firebase offers only
`nodejs18/20/22`, so they cannot follow the frontends up — `ci-hackathon-functions` and
`ci-flea-market-functions` stay on 22 for that reason alone. Everywhere else Node is build
tooling only (the deployed Workers do not run Node), so it tracks the current LTS. Keep each
package's `.nvmrc`, `engines.node` and workflow `node-version` on the same major. The
`engines.node` entries that read `>=22` (repo root) and `>=20.9.0` (`xymposium-lp-2024`) are
floors, not runtime selectors, and are left permissive on purpose.

**Firebase CD (follow-up).** The per-app *deploy* workflows imported from the source repos live
under `apps/<name>/.github/workflows/` and remain **inert** on purpose — they are the spec for
the deferred work, not live config. The `hackathon` / `flea-market` Firebase deploys still need
their OIDC + Workload Identity Federation trust re-bound from the old repositories
(`nemtus/hackathon`, `nemtus/symbol-fest-market`) to `nemtus/apps`, which is Google Cloud–side
work, or migrating to their Cloudflare equivalents. The `firebase-hosting-*` workflows under the
four `hackathon-lp*` sites are obsolete rather than pending: those sites are on Cloudflare now.

## Roadmap

Phased migration (Firebase → Cloudflare). **Phase 0 (this commit): monorepo foundation with
history preserved; every app still deploys to its current Firebase project, behaviour
identical.** Then: Phase 1 shared Cloudflare packages; Phase 2 pilot (`flea-market`); Phase 3
`hackathon`; Phase 4 LP sites; Phase 5 decommission Firebase. Auth migrates via Better Auth
on Workers×D1 with **lazy scrypt re-hash** (Firebase passwords keep working) and Firebase-uid
preserved as the D1 `user.id`.

## History

This repo consolidates formerly separate repositories, preserving their full git history
under `apps/<name>/`:

| `apps/` dir | Source repo |
| --- | --- |
| `hackathon` | `nemtus/hackathon` |
| `flea-market` | `nemtus/symbol-fest-market` (renamed) |
| `hackathon-lp` | `nemtus/hackathon-lp` |
| `hackathon-lp-2023` | `nemtus/hackathon-lp-2023` |
| `hackathon-lp-2024` | `nemtus/hackathon-lp-2024` |
| `hackathon-lp-2025` | `nemtus/hackathon-lp-2025` |
| `xymposium-lp-2024` | `nemtus/symbol-community-xymposium-2024` |
| `xymposium-lp-2025` | `nemtus/xymposium-lp` |

Import was done with `git filter-repo --to-subdirectory-filter` + merge
`--allow-unrelated-histories`, so `git log --follow` and `git blame` work across the move.
Any source tags would be namespaced `<name>-legacy-*` (the source repos had none). The
predecessor repositories are superseded by this monorepo.

Note the XYMPOSIUM naming: the source repo `nemtus/xymposium-lp` held the *2025* event site, so
it maps to `apps/xymposium-lp-2025`; the name `apps/xymposium-lp` is reused for the **new**,
authored-in-monorepo redirect aggregator (no source repo).
