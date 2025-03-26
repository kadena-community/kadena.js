module.exports = {
  root: true,
  env: { es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForStatement',
        message:
          'Using for loops is not allowed in PactScript. Use for-of instead.',
      },
      {
        selector: 'WhileStatement',
        message:
          'Using while loops is not allowed in PactScript. Use for-of instead.',
      },
      {
        selector: 'DoWhileStatement',
        message:
          'Using do-while loops is not allowed in PactScript. Use for-of instead.',
      },
      {
        selector: 'ForInStatement',
        message:
          'Using for-in loops is not allowed in PactScript. Use for-of instead.',
      },
    ],
  },
};
