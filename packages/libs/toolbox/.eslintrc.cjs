require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/lib'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
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
  ignorePatterns: ['vitest.*.ts'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/function-component-definition': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/parameter-properties': 'off',
    '@typescript-eslint/typedef': 'off',
    'require-atomic-updates': ['error', { allowProperties: true }],
  },
};
