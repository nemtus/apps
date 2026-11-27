// ESLint flat config.
//
// This used to extend `airbnb` + `airbnb-typescript` (.eslintrc.json). Both are
// unmaintained and hold the toolchain back: `eslint-config-airbnb` pins
// `eslint-plugin-react-hooks` to ^4 and ESLint to 8, and
// `eslint-config-airbnb-typescript` pins typescript-eslint to v7. The plugins
// airbnb pulled in (react, jsx-a11y, import) are now configured directly with
// their own recommended presets, and the airbnb rule set this app was linted with
// is kept as a snapshot in `eslint.airbnb-rules.mjs` (see that file).
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import airbnbRules from './eslint.airbnb-rules.mjs';

export default tseslint.config(
  { ignores: ['build/**'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    plugins: { 'unused-imports': unusedImports },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
    rules: {
      ...airbnbRules,

      // App-specific rules, carried over unchanged from .eslintrc.json.
      'no-use-before-define': 'off', // use the TypeScript-aware version below
      '@typescript-eslint/no-use-before-define': 'error',
      'import/prefer-default-export': 'off', // allow named exports
      '@typescript-eslint/no-unused-vars': 'off', // replaced by unused-imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'no-param-reassign': ['error', { props: false }], // allow mutating parameter properties
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
      'react/react-in-jsx-scope': 'off', // automatic JSX runtime
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/jsx-props-no-spreading': 'off',
      'react/prop-types': 'off', // TypeScript checks props
      'no-void': ['error', { allowAsStatement: true }],
      'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' }],
    },
  },
  {
    files: ['src/setupTests.ts', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  prettier,
);
