// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/next',
    'next/babel',
    'next/core-web-vitals',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@kadena-dev/typedef-var': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: '.',
      }, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};
