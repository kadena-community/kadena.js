require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/lib',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['vitest.projects.ts'],
};
