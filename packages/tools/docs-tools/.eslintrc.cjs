// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/lib'],
  parserOptions: { tsconfigRootDir: __dirname, project: ['./tsconfig.json'] },
  ignorePatterns: ['**/coverage/**', 'playwright.config.ts'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@kadena-dev/typedef-var': 'off',
  },
};
