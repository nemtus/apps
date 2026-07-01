/**
 * Shared Prettier config for the nemtus/apps shared packages (packages/*).
 * apps/* keep their own Prettier config (they differ: hackathon 80, flea-market 120).
 * Usage in a package: `export { default } from '@nemtus/config/prettier';`
 */
export default {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
};
