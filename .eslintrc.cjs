require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jquery: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
    '@vue/eslint-config-airbnb',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
    'plugin:prettier/recommended',
  ],
  globals: {
    moment: 'readonly',
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

    // TypeScript
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
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/heading-has-content': 'off',
    'vuejs-accessibility/iframe-has-title': 'off',
    'vuejs-accessibility/interactive-supports-focus': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/media-has-caption': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
    'vuejs-accessibility/no-access-key': 'off',
    'vuejs-accessibility/no-autofocus': 'off',
    'vuejs-accessibility/no-distracting-elements': 'off',
    'vuejs-accessibility/no-onchange': 'off',
    'vuejs-accessibility/no-redundant-roles': 'off',
    'vuejs-accessibility/role-has-required-aria-props': 'off',
    'vuejs-accessibility/role-supports-aria-props': 'off',
    'vuejs-accessibility/scope': 'off',
    'vuejs-accessibility/tabindex-no-positive': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        alias: {
          '@': './src',
        },
        extensions: ['.ts', '.vue'],
      },
    },
  },
}
