// The rules eslint-config-airbnb@19.0.4 + eslint-config-airbnb-typescript@18.0.0
// (with eslint-config-airbnb-base@15.0.0) resolved to for this app, frozen when
// those configs were removed. Generated from `eslint --print-config` on the old
// .eslintrc.json; only rules whose setting differs from what the plugin presets in
// eslint.config.mjs already give are listed. Edit freely: this is now our config.
//
// Rules airbnb enabled that were deliberately not carried over:
//   @typescript-eslint/ban-types: Removed in typescript-eslint 8; split into no-empty-object-type / no-unsafe-function-type / no-wrapper-object-types, all on via the preset.
//   @typescript-eslint/lines-between-class-members: Removed in typescript-eslint 8 (formatting; Prettier owns it).
//   @typescript-eslint/no-dupe-class-members: TypeScript reports it; typescript-eslint advises against it.
//   @typescript-eslint/no-loop-func: Deprecated in typescript-eslint 8; replaced by core no-loop-func (enabled).
//   @typescript-eslint/no-loss-of-precision: Deprecated in typescript-eslint 8; core no-loss-of-precision is on via eslint:recommended.
//   @typescript-eslint/no-redeclare: TypeScript reports it; typescript-eslint advises against it.
//   @typescript-eslint/no-throw-literal: Removed in typescript-eslint 8; @typescript-eslint/only-throw-error is on via the preset.
//   @typescript-eslint/no-var-requires: Removed in typescript-eslint 8; @typescript-eslint/no-require-imports is on via the preset.
//   global-require: Deprecated Node.js rule; @typescript-eslint/no-require-imports covers require() in TS.
//   lines-around-directive: Deprecated formatting rule.
//   no-buffer-constructor: Deprecated Node.js rule.
//   no-class-assign: TypeScript reports it (ts(2629)).
//   no-inner-declarations: Dropped from eslint:recommended in ESLint 9.
//   no-new-object: Deprecated in ESLint 9; replaced by no-object-constructor (enabled).
//   no-new-require: Deprecated Node.js rule.
//   no-path-concat: Deprecated Node.js rule.
//   no-with: TypeScript reports it (strict mode); typescript-eslint turns the core rule off.
//   prefer-promise-reject-errors: Replaced by @typescript-eslint/prefer-promise-reject-errors (same airbnb option, allowEmptyReject).
//   react/default-props-match-prop-types: Class components / propTypes only; the app has neither.
//   react/forbid-foreign-prop-types: Class components / propTypes only; the app has neither.
//   react/forbid-prop-types: Class components / propTypes only; the app has neither.
//   react/jsx-uses-react: Not needed with the automatic JSX runtime.
//   react/no-access-state-in-setstate: Class components / propTypes only; the app has neither.
//   react/no-arrow-function-lifecycle: Class components / propTypes only; the app has neither.
//   react/no-did-update-set-state: Class components / propTypes only; the app has neither.
//   react/no-redundant-should-component-update: Class components / propTypes only; the app has neither.
//   react/no-unused-class-component-methods: Class components / propTypes only; the app has neither.
//   react/no-unused-state: Class components / propTypes only; the app has neither.
//   react/no-will-update-set-state: Class components / propTypes only; the app has neither.
//   react/prefer-es6-class: Class components / propTypes only; the app has neither.
//   react/prefer-exact-props: Class components / propTypes only; the app has neither.
//   react/prefer-stateless-function: Class components / propTypes only; the app has neither.
//   react/require-default-props: Class components / propTypes only; the app has neither.
//   react/sort-comp: Class components / propTypes only; the app has neither.
//   react/state-in-constructor: Class components / propTypes only; the app has neither.
//   react/static-property-placement: Class components / propTypes only; the app has neither.
//   spaced-comment: Deprecated formatting rule (moved to @stylistic).
//
// Renamed rules carried over under their new name: no-loop-func,
// no-object-constructor, @typescript-eslint/prefer-promise-reject-errors.
const airbnbRules = {
  '@typescript-eslint/default-param-last': 'error',
  '@typescript-eslint/dot-notation': [
    'error',
    {
      allowKeywords: true,
      allowPattern: '',
      allowPrivateClassPropertyAccess: false,
      allowProtectedClassPropertyAccess: false,
      allowIndexSignaturePropertyAccess: false,
    },
  ],
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'variable',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
    },
    {
      selector: 'function',
      format: ['camelCase', 'PascalCase'],
    },
    {
      selector: 'typeLike',
      format: ['PascalCase'],
    },
  ],
  '@typescript-eslint/no-empty-function': [
    'error',
    {
      allow: ['arrowFunctions', 'functions', 'methods'],
    },
  ],
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-unused-expressions': [
    'error',
    {
      allowShortCircuit: false,
      allowTernary: false,
      allowTaggedTemplates: false,
      enforceForJSX: false,
    },
  ],
  '@typescript-eslint/no-use-before-define': [
    'error',
    {
      functions: true,
      classes: true,
      variables: true,
    },
  ],
  '@typescript-eslint/no-useless-constructor': 'error',
  '@typescript-eslint/prefer-promise-reject-errors': [
    'error',
    {
      allowEmptyReject: true,
    },
  ],
  '@typescript-eslint/return-await': ['error', 'in-try-catch'],
  'array-callback-return': [
    'error',
    {
      allowImplicit: true,
      checkForEach: false,
      allowVoid: false,
    },
  ],
  'arrow-body-style': [
    'error',
    'as-needed',
    {
      requireReturnForObjectLiteral: false,
    },
  ],
  'block-scoped-var': 'error',
  'class-methods-use-this': [
    'error',
    {
      exceptMethods: [
        'render',
        'getInitialState',
        'getDefaultProps',
        'getChildContext',
        'componentWillMount',
        'UNSAFE_componentWillMount',
        'componentDidMount',
        'componentWillReceiveProps',
        'UNSAFE_componentWillReceiveProps',
        'shouldComponentUpdate',
        'componentWillUpdate',
        'UNSAFE_componentWillUpdate',
        'componentDidUpdate',
        'componentWillUnmount',
        'componentDidCatch',
        'getSnapshotBeforeUpdate',
      ],
      enforceForClassFields: true,
    },
  ],
  'consistent-return': 'error',
  'default-case': [
    'error',
    {
      commentPattern: '^no default$',
    },
  ],
  'default-case-last': 'error',
  eqeqeq: [
    'error',
    'always',
    {
      null: 'ignore',
    },
  ],
  'func-names': 'warn',
  'grouped-accessor-pairs': 'error',
  'guard-for-in': 'error',
  'import/first': 'error',
  'import/newline-after-import': 'error',
  'import/no-absolute-path': 'error',
  'import/no-amd': 'error',
  'import/no-cycle': [
    'error',
    {
      maxDepth: '∞',
      ignoreExternal: false,
      allowUnsafeDynamicCyclicDependency: false,
      disableScc: false,
    },
  ],
  'import/no-dynamic-require': 'error',
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: [
        'test/**',
        'tests/**',
        'spec/**',
        '**/__tests__/**',
        '**/__mocks__/**',
        'test.{js,jsx}',
        'test.{ts,tsx}',
        'test-*.{js,jsx}',
        'test-*.{ts,tsx}',
        '**/*{.,_}{test,spec}.{js,jsx}',
        '**/*{.,_}{test,spec}.{ts,tsx}',
        '**/jest.config.js',
        '**/jest.config.ts',
        '**/jest.setup.js',
        '**/jest.setup.ts',
        '**/vue.config.js',
        '**/vue.config.ts',
        '**/webpack.config.js',
        '**/webpack.config.ts',
        '**/webpack.config.*.js',
        '**/webpack.config.*.ts',
        '**/rollup.config.js',
        '**/rollup.config.ts',
        '**/rollup.config.*.js',
        '**/rollup.config.*.ts',
        '**/gulpfile.js',
        '**/gulpfile.ts',
        '**/gulpfile.*.js',
        '**/gulpfile.*.ts',
        '**/Gruntfile{,.js}',
        '**/Gruntfile{,.ts}',
        '**/protractor.conf.js',
        '**/protractor.conf.ts',
        '**/protractor.conf.*.js',
        '**/protractor.conf.*.ts',
        '**/karma.conf.js',
        '**/karma.conf.ts',
        '**/.eslintrc.js',
        '**/.eslintrc.ts',
      ],
      optionalDependencies: false,
    },
  ],
  'import/no-import-module-exports': [
    'error',
    {
      exceptions: [],
    },
  ],
  'import/no-mutable-exports': 'error',
  'import/no-named-default': 'error',
  'import/no-relative-packages': 'error',
  'import/no-self-import': 'error',
  'import/no-unresolved': [
    'error',
    {
      commonjs: true,
      caseSensitive: true,
      caseSensitiveStrict: false,
    },
  ],
  'import/no-useless-path-segments': [
    'error',
    {
      commonjs: true,
    },
  ],
  'import/no-webpack-loader-syntax': 'error',
  'import/order': [
    'error',
    {
      groups: [['builtin', 'external', 'internal']],
      distinctGroup: true,
      sortTypesGroup: false,
      named: false,
      warnOnUnassignedImports: false,
    },
  ],
  'jsx-a11y/alt-text': [
    'error',
    {
      elements: ['img', 'object', 'area', 'input[type="image"]'],
      img: [],
      object: [],
      area: [],
      'input[type="image"]': [],
    },
  ],
  'jsx-a11y/anchor-has-content': [
    'error',
    {
      components: [],
    },
  ],
  'jsx-a11y/anchor-is-valid': [
    'error',
    {
      components: ['Link'],
      specialLink: ['to'],
      aspects: ['noHref', 'invalidHref', 'preferButton'],
    },
  ],
  'jsx-a11y/aria-role': [
    'error',
    {
      ignoreNonDOM: false,
    },
  ],
  'jsx-a11y/control-has-associated-label': [
    'error',
    {
      labelAttributes: ['label'],
      controlComponents: [],
      ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
      ignoreRoles: [
        'grid',
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'row',
        'tablist',
        'toolbar',
        'tree',
        'treegrid',
      ],
      depth: 5,
    },
  ],
  'jsx-a11y/heading-has-content': [
    'error',
    {
      components: [''],
    },
  ],
  'jsx-a11y/interactive-supports-focus': 'error',
  'jsx-a11y/label-has-associated-control': [
    'error',
    {
      labelComponents: [],
      labelAttributes: [],
      controlComponents: [],
      assert: 'both',
      depth: 25,
    },
  ],
  'jsx-a11y/lang': 'error',
  'jsx-a11y/media-has-caption': [
    'error',
    {
      audio: [],
      video: [],
      track: [],
    },
  ],
  'jsx-a11y/no-autofocus': [
    'error',
    {
      ignoreNonDOM: true,
    },
  ],
  'jsx-a11y/no-distracting-elements': [
    'error',
    {
      elements: ['marquee', 'blink'],
    },
  ],
  'jsx-a11y/no-interactive-element-to-noninteractive-role': [
    'error',
    {
      tr: ['none', 'presentation'],
    },
  ],
  'jsx-a11y/no-noninteractive-element-interactions': [
    'error',
    {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
    },
  ],
  'jsx-a11y/no-noninteractive-element-to-interactive-role': [
    'error',
    {
      ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
      ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
      li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
      table: ['grid'],
      td: ['gridcell'],
    },
  ],
  'jsx-a11y/no-noninteractive-tabindex': [
    'error',
    {
      tags: [],
      roles: ['tabpanel'],
    },
  ],
  'jsx-a11y/no-static-element-interactions': [
    'error',
    {
      handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
    },
  ],
  'max-classes-per-file': ['error', 1],
  'new-cap': [
    'error',
    {
      newIsCap: true,
      newIsCapExceptions: [],
      capIsNew: false,
      capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
      properties: true,
    },
  ],
  'no-alert': 'warn',
  'no-await-in-loop': 'error',
  'no-bitwise': 'error',
  'no-caller': 'error',
  'no-cond-assign': ['error', 'always'],
  'no-console': 'warn',
  'no-constant-condition': 'warn',
  'no-constructor-return': 'error',
  'no-continue': 'error',
  'no-else-return': [
    'error',
    {
      allowElseIf: false,
    },
  ],
  'no-empty': 'error',
  'no-empty-pattern': 'error',
  'no-eval': 'error',
  'no-extend-native': 'error',
  'no-extra-bind': 'error',
  'no-extra-boolean-cast': 'error',
  'no-extra-label': 'error',
  'no-fallthrough': 'error',
  'no-invalid-regexp': 'error',
  'no-irregular-whitespace': 'error',
  'no-iterator': 'error',
  'no-label-var': 'error',
  'no-labels': [
    'error',
    {
      allowLoop: false,
      allowSwitch: false,
    },
  ],
  'no-lone-blocks': 'error',
  'no-lonely-if': 'error',
  'no-loop-func': 'error',
  'no-misleading-character-class': 'error',
  'no-multi-assign': 'error',
  'no-multi-str': 'error',
  'no-nested-ternary': 'error',
  'no-new': 'error',
  'no-new-wrappers': 'error',
  'no-object-constructor': 'error',
  'no-octal-escape': 'error',
  'no-plusplus': 'error',
  'no-promise-executor-return': 'error',
  'no-proto': 'error',
  'no-restricted-exports': [
    'error',
    {
      restrictedNamedExports: ['default', 'then'],
    },
  ],
  'no-restricted-globals': [
    'error',
    {
      name: 'isFinite',
      message: 'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
    },
    {
      name: 'isNaN',
      message: 'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
    },
    'addEventListener',
    'blur',
    'close',
    'closed',
    'confirm',
    'defaultStatus',
    'defaultstatus',
    'event',
    'external',
    'find',
    'focus',
    'frameElement',
    'frames',
    'history',
    'innerHeight',
    'innerWidth',
    'length',
    'location',
    'locationbar',
    'menubar',
    'moveBy',
    'moveTo',
    'name',
    'onblur',
    'onerror',
    'onfocus',
    'onload',
    'onresize',
    'onunload',
    'open',
    'opener',
    'opera',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'parent',
    'print',
    'removeEventListener',
    'resizeBy',
    'resizeTo',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scroll',
    'scrollbars',
    'scrollBy',
    'scrollTo',
    'scrollX',
    'scrollY',
    'self',
    'status',
    'statusbar',
    'stop',
    'toolbar',
    'top',
  ],
  'no-restricted-properties': [
    'error',
    {
      object: 'arguments',
      property: 'callee',
      message: 'arguments.callee is deprecated',
    },
    {
      object: 'global',
      property: 'isFinite',
      message: 'Please use Number.isFinite instead',
    },
    {
      object: 'self',
      property: 'isFinite',
      message: 'Please use Number.isFinite instead',
    },
    {
      object: 'window',
      property: 'isFinite',
      message: 'Please use Number.isFinite instead',
    },
    {
      object: 'global',
      property: 'isNaN',
      message: 'Please use Number.isNaN instead',
    },
    {
      object: 'self',
      property: 'isNaN',
      message: 'Please use Number.isNaN instead',
    },
    {
      object: 'window',
      property: 'isNaN',
      message: 'Please use Number.isNaN instead',
    },
    {
      property: '__defineGetter__',
      message: 'Please use Object.defineProperty instead.',
    },
    {
      property: '__defineSetter__',
      message: 'Please use Object.defineProperty instead.',
    },
    {
      object: 'Math',
      property: 'pow',
      message: 'Use the exponentiation operator (**) instead.',
    },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ForInStatement',
      message:
        'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
    },
    {
      selector: 'ForOfStatement',
      message:
        'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
    },
    {
      selector: 'LabeledStatement',
      message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
    },
    {
      selector: 'WithStatement',
      message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
    },
  ],
  'no-return-assign': ['error', 'always'],
  'no-script-url': 'error',
  'no-self-compare': 'error',
  'no-sequences': 'error',
  'no-shadow-restricted-names': 'error',
  'no-template-curly-in-string': 'error',
  'no-undef-init': 'error',
  'no-underscore-dangle': [
    'error',
    {
      allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
      allowAfterThis: false,
      allowAfterSuper: false,
      enforceInMethodNames: true,
      allowAfterThisConstructor: false,
      allowFunctionParams: true,
      enforceInClassFields: false,
      allowInArrayDestructuring: true,
      allowInObjectDestructuring: true,
    },
  ],
  'no-unneeded-ternary': [
    'error',
    {
      defaultAssignment: false,
    },
  ],
  'no-unreachable-loop': [
    'error',
    {
      ignore: [],
    },
  ],
  'no-unsafe-optional-chaining': [
    'error',
    {
      disallowArithmeticOperators: true,
    },
  ],
  'no-useless-computed-key': 'error',
  'no-useless-concat': 'error',
  'no-useless-escape': 'error',
  'no-useless-rename': [
    'error',
    {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    },
  ],
  'no-useless-return': 'error',
  'object-shorthand': [
    'error',
    'always',
    {
      ignoreConstructors: false,
      avoidQuotes: true,
    },
  ],
  'one-var': ['error', 'never'],
  'operator-assignment': ['error', 'always'],
  'prefer-arrow-callback': [
    'error',
    {
      allowNamedFunctions: false,
      allowUnboundThis: true,
    },
  ],
  'prefer-const': [
    'error',
    {
      destructuring: 'any',
      ignoreReadBeforeAssign: true,
    },
  ],
  'prefer-destructuring': [
    'error',
    {
      VariableDeclarator: {
        array: false,
        object: true,
      },
      AssignmentExpression: {
        array: true,
        object: false,
      },
    },
    {
      enforceForRenamedProperties: false,
    },
  ],
  'prefer-exponentiation-operator': 'error',
  'prefer-numeric-literals': 'error',
  'prefer-object-spread': 'error',
  'prefer-regex-literals': [
    'error',
    {
      disallowRedundantWrapping: true,
    },
  ],
  'prefer-template': 'error',
  radix: 'error',
  'react/button-has-type': [
    'error',
    {
      button: true,
      submit: true,
      reset: false,
    },
  ],
  'react/destructuring-assignment': ['error', 'always'],
  'react/jsx-boolean-value': [
    'error',
    'never',
    {
      always: [],
    },
  ],
  'react/jsx-curly-brace-presence': [
    'error',
    {
      props: 'never',
      children: 'never',
    },
  ],
  'react/jsx-fragments': ['error', 'syntax'],
  'react/jsx-no-bind': [
    'error',
    {
      ignoreRefs: true,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false,
      ignoreDOMComponents: true,
    },
  ],
  'react/jsx-no-constructed-context-values': 'error',
  'react/jsx-no-duplicate-props': [
    'error',
    {
      ignoreCase: true,
    },
  ],
  'react/jsx-no-script-url': [
    'error',
    [
      {
        name: 'Link',
        props: ['to'],
      },
    ],
  ],
  'react/jsx-no-target-blank': [
    'error',
    {
      enforceDynamicLinks: 'always',
      links: true,
      forms: false,
    },
  ],
  'react/jsx-no-useless-fragment': 'error',
  'react/jsx-pascal-case': [
    'error',
    {
      allowAllCaps: true,
      ignore: [],
    },
  ],
  'react/no-array-index-key': 'error',
  'react/no-danger': 'warn',
  'react/no-invalid-html-attribute': 'error',
  'react/no-namespace': 'error',
  'react/no-this-in-sfc': 'error',
  'react/no-typos': 'error',
  'react/no-unstable-nested-components': 'error',
  'react/no-unused-prop-types': [
    'error',
    {
      customValidators: [],
      skipShapeProps: true,
    },
  ],
  'react/self-closing-comp': 'error',
  'react/style-prop-object': 'error',
  'react/void-dom-elements-no-children': 'error',
  strict: ['error', 'never'],
  'symbol-description': 'error',
  'unicode-bom': ['error', 'never'],
  'use-isnan': 'error',
  'vars-on-top': 'error',
  yoda: 'error',
};

export default airbnbRules;
