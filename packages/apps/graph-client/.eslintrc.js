// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['next/core-web-vitals', '@kadena-dev/eslint-config/profile/react'],
  parserOptions: { tsconfigRootDir: __dirname },
};
