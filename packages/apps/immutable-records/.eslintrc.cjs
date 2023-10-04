// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/next', 'next/core-web-vitals'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    '@kadena-dev/typedef-var': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@rushstack/no-new-null': 'off',
    '@typescript-eslint/typedef': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    // TODO: fix tsconfig paths configuration for eslint
    'import/no-unresolved': 'off',
  },
};
