// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@kadena-dev/eslint-config/profile/lib');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/lib'],
  parserOptions: { tsconfigRootDir: __dirname },
};
