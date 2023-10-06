require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  plugins: ['jest'],
  extends: [
    '@kadena-dev/eslint-config/profile/next',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:playwright/recommended'
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['**/generated/**'],
  rules: {
    '@kadena-dev/typedef-var': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
