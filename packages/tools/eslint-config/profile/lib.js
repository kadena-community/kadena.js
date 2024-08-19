const { join } = require('node:path');

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
    '../mixins/typedef-allow-implicitly-typed-parameters.js',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@kadena-dev/eslint-plugin', 'import'],
  rules: {
    '@kadena-dev/no-eslint-disable': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-template': 'warn',
    'import/no-unresolved': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    '@rushstack/typedef-var': 'off',
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'TSEnumDeclaration',
        message: 'Use `Record<string, string|number>` with `as const` instead.',
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: true,
      typescript: {
        project: [join(process.cwd(), 'tsconfig.json')],
      },
    },
  },
};
