// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/react',
    'plugin:storybook/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@rushstack/no-new-null': 'off',
  },

  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  ignorePatterns: [
    'vitest.*.ts',
    'dist',
    '.storybook',
    'storybook-static',
    '.eslintrc.cjs',
  ],
};
