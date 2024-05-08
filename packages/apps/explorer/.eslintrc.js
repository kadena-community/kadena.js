// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/next'],
  ignorePatterns: ['**/__generated__/**'],
  parserOptions: { tsconfigRootDir: __dirname },
};
