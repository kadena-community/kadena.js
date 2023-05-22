require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/next'],
  parserOptions: { tsconfigRootDir: __dirname },
};
