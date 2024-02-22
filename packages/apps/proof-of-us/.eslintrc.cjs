// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/next',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'next/core-web-vitals',
  ],
  plugins: ['import'],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['**/generated/**', '**/src/__generated__/**', 'vitest.*.ts'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    '@kadena-dev/typedef-var': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
  },
};
