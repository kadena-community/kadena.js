require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  plugins: ['jest'],
  extends: ['@kadena-dev/eslint-config/profile/next'],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['**/generated/**'],
  settings: {
    'import/resolver': {
      typescript: {}
    },
  },
};
