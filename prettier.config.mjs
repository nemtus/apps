// Root Prettier config for the shared workspaces: the packages directory and the
// backend workers under apps. Mirrors the shared @nemtus/config preset. The app
// frontends keep their own Prettier config (nearest-wins), so this does not touch them.
export default {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: "all",
  semi: true,
}
