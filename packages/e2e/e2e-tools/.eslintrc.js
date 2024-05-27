require('@rushstack/eslint-config/patch/modern-module-resolution');
const { join } = require('path');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/lib',
    'plugin:playwright/recommended',
  ],
  parserOptions: { tsconfigRootDir: __dirname, ecmaVersion: 'latest' },
  rules: {},
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    playwright: {
      globalAliases: {
        test: ['setup'],
      },
    },
    'import/resolver': {
      node: true,
      typescript: {
        project: [join(__dirname, 'tsconfig.json')],
      },
    },
  },
};
