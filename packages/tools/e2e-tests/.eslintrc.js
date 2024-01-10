require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/lib',
    'plugin:playwright/recommended',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
};
