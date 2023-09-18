require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  plugins: ['jest'],
  extends: [
    '@kadena-dev/eslint-config/profile/next',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['**/generated/**'],
};
