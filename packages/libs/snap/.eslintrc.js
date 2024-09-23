module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn"
  },
  ignorePatterns: ['!.eslintrc.js', 'dist/'],
};
