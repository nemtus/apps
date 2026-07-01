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
  hackathon-lp-2024/
  hackathon-lp-2025/
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

## CI/CD status (follow-up required)

The per-app deploy workflows imported from the source repos now live under
`apps/<name>/.github/workflows/` and are **inert** — GitHub only runs workflows from the
repo-root `.github/workflows/`. Root-level, **path-filtered** workflows (one trigger per app,
`on.push.paths: ['apps/<name>/**']`) that re-establish the existing **OIDC + Workload
Identity Federation** keyless deploy to each app's Firebase project still need to be authored.
This requires the org's WIF provider + per-app deploy secrets and is tracked as a follow-up.

## Roadmap

Phased migration (Firebase → Cloudflare). **Phase 0 (this commit): monorepo foundation with
history preserved; every app still deploys to its current Firebase project, behaviour
identical.** Then: Phase 1 shared Cloudflare packages; Phase 2 pilot (`flea-market`); Phase 3
`hackathon`; Phase 4 LP sites; Phase 5 decommission Firebase. Auth migrates via Better Auth
on Workers×D1 with **lazy scrypt re-hash** (Firebase passwords keep working) and Firebase-uid
preserved as the D1 `user.id`.

## History

This repo consolidates six formerly separate repositories, preserving their full git history
under `apps/<name>/`:

| `apps/` dir | Source repo |
| --- | --- |
| `hackathon` | `nemtus/hackathon` |
| `flea-market` | `nemtus/symbol-fest-market` (renamed) |
| `hackathon-lp` | `nemtus/hackathon-lp` |
| `hackathon-lp-2023` | `nemtus/hackathon-lp-2023` |
| `hackathon-lp-2024` | `nemtus/hackathon-lp-2024` |
| `hackathon-lp-2025` | `nemtus/hackathon-lp-2025` |

Import was done with `git filter-repo --to-subdirectory-filter` + merge
`--allow-unrelated-histories`, so `git log --follow` and `git blame` work across the move.
Any source tags would be namespaced `<name>-legacy-*` (the source repos had none). The
predecessor repositories are superseded by this monorepo.
