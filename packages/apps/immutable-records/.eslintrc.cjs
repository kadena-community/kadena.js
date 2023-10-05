// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/next', 'next/core-web-vitals'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    // Maybe useful for libs, only causes bloat and duplication for apps
    '@typescript-eslint/explicit-function-return-type': 'off',
    // This is fine for libs, but this app will not export any types
    '@typescript-eslint/naming-convention': 'off',
    // Works fine with typescript
    '@rushstack/no-new-null': 'off',
    // The official docs recommend against it: https://typescript-eslint.io/rules/typedef/
    // Typescript is better at inferring and using `noImplicitAny` is sufficient
    '@typescript-eslint/typedef': 'off',
    '@kadena-dev/typedef-var': 'off',
    // This rule is too strict for our use case
    '@typescript-eslint/strict-boolean-expressions': 'off',
    // TODO: eslint in vscode does not understand tsconfig paths and gives errors
    //       even though in the build it works fine
    'import/no-unresolved': 'off',
  },
};
