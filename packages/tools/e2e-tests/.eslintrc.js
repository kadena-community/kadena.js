require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@kadena-dev/eslint-config/profile/lib',
    'plugin:playwright/recommended',
  ],
  "import/resolver": {
    "typescript": {}
  },
  parser: "@typescript-eslint/parser",
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    '@kadena-dev/typedef-var': 'off',
    '@rushstack/typedef-var': 'off',
  },
  plugins: [
    "@typescript-eslint",
    "import"
  ]
};
