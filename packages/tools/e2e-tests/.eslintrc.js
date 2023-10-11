require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/next',
    'plugin:playwright/recommended',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['playwright.config.ts'],
};
