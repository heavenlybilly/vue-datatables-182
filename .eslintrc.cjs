require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
    'plugin:prettier/recommended',
  ],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  rules: {
    'import/no-unresolved': ['error', { ignore: ['\\.svg\\$'] }],
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': 'off',

    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],

    // TypeScript
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        enums: true,
        typedefs: true,
        ignoreTypeReferences: true,
      },
    ],

    // Prettier
    'prettier/prettier': 'error',

    // Vue
    'vue/v-on-event-hyphenation': 'error',
    'vue/attributes-order': ['error', { alphabetical: true }],
    'vue/no-v-html': 'off',
    'vue/html-button-has-type': 'error',
    'vue/multi-word-component-names': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'error',
    'vuejs-accessibility/form-control-has-label': 'error',
    'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
  },
  overrides: [
    {
      files: ['src/**/*.{ts,vue}', 'scripts/**/*.{ts,vue,mjs,cjs}'],
      rules: {
        curly: ['error', 'all'],
        'object-curly-newline': [
          'error',
          { ObjectExpression: { minProperties: 1, consistent: true } },
        ],
      },
    },
    {
      files: ['src/components/layout/table/body/TableRow.vue'],
      rules: {
        'vuejs-accessibility/interactive-supports-focus': 'off',
        'vuejs-accessibility/click-events-have-key-events': 'off',
      },
    },
    {
      files: [
        '*.js',
        '*.cjs',
        'scripts/**/*.mjs',
        'scripts/package-check/*.ts',
        'scripts/package-check/*.vue',
      ],
      parserOptions: { project: null, ecmaVersion: 'latest' },
    },
    {
      files: ['scripts/package-check/**'],
      rules: {
        'import/no-unresolved': [
          'error',
          { ignore: ['^vue-datatables-182(?:/dist/index\\.css)?$'] },
        ],
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: { project: './tsconfig.json' },
    },
  },
}
