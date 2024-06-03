require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/next',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['**/generated/**', 'vitest.*.ts'],

  rules: {
    '@kadena-dev/typedef-var': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@rushstack/no-new-null': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'no-void': 'off',
    'react/function-component-definition': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useAsync|useAsyncCallback)',
      },
    ],
  },
};
