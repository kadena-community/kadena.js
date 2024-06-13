// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/next'],
  ignorePatterns: ['**/__generated__/**'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    // graphql uses `null`s a lot, and we need to exclude them in types
    // e.g. Exclude<TransactionResult, null> is a common pattern
    '@rushstack/no-new-null': 'off',
  },
};
