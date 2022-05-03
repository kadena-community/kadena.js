const { resolve } = require('path');

module.exports = {
  root: true,
  extends: 'airbnb-typescript/base',
  plugins: ['import', 'prettier', 'jest'],
  parserOptions: {
    project: resolve(__dirname, './tsconfig.eslint.json'),
  },
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
  env: {
    'jest/globals': true,
  },
};
