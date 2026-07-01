# @nemtus/config

Shared config presets for the `nemtus/apps` shared packages.

- **Prettier**: `export { default } from '@nemtus/config/prettier';`
- **TypeScript**: packages extend the repo-root `tsconfig.base.json`
  (`"extends": "../../tsconfig.base.json"`), which targets Cloudflare Workers
  (ES2022, `moduleResolution: Bundler`, `verbatimModuleSyntax`, strict).

`apps/*` are intentionally **not** covered here — they keep their own tooling.
