// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

const fs = require('fs');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/react',
    'plugin:storybook/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
  },
  env: {
    es6: true,
  },
};
