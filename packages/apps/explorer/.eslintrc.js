// This is a workaround for https://github.com/eslint/eslint/issues/3458

require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena/eslint-config/profile/lib',
    'eslint-config-airbnb-typescript',
    '@next/eslint-plugin-next',
    'eslint-config-prettier',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-react',
    'eslint-plugin-unused-imports',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
};
