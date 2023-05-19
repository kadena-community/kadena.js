require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  // TODO: Disabled until we use Next.js.
  // extends: ['@kadena-dev/eslint-config/profile/next'],
  parserOptions: { tsconfigRootDir: __dirname },
};
