// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

const fs = require('fs');
const prettierOptions = JSON.parse(fs.readFileSync('./.prettierrc', 'utf8'));

module.exports = {
  plugins: ['jest', 'jsx-a11y', 'storybook', 'prettier'],
  extends: [
    '@kadena-dev/eslint-config/profile/react',
    'plugin:storybook/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'comma-dangle': [2, 'always-multiline'],
    'prefer-template': 1,
    'import/newline-after-import': 1,
    'import/no-unresolved': 2,
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/heading-has-content': 1,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
  },
  env: {
    es6: true,
  },
};
