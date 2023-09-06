/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@rushstack/eslint-config/profile/node',
    // add when api-extractor is integrated
    // '@rushstack/eslint-config/mixins/tsdoc',
    // '@rushstack/eslint-config/mixins/friendly-locals',
    '../mixins/strict-boolean-expressions.js',
    '../mixins/import-no-duplicates.js',
    '../mixins/simple-import-sort.js',
    '../mixins/typedef-allow-implicitly-typed-parameters.js',
    'prettier',
  ],
  plugins: ['@kadena-dev/eslint-plugin', 'import', 'simple-import-sort'],
  rules: {
    '@kadena-dev/no-eslint-disable': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-template': 'warn',
    'import/newline-after-import': 'error',
    'import/no-unresolved': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: 'packages/*/*/tsconfig.json',
      },
    },
  },
};
