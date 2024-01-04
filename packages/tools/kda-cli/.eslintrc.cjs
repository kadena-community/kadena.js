// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  ignorePatterns: ['**/tests/*'],
  extends: ['@kadena-dev/eslint-config/profile/lib'],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['vitest.*.ts'],
};
