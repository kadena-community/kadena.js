require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/next'],
  parserOptions: { tsconfigRootDir: __dirname, project: ['./tsconfig.json'] },
  ignorePatterns: ['**/generated/**', 'playwright.config.ts'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@kadena-dev/typedef-var': 'off',
  },
};
