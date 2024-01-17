const { join } = require('node:path');

module.exports = {
  extends: ['next', 'plugin:react/recommended', 'prettier'],
  plugins: ['testing-library', 'react', 'react-hooks', 'jsx-a11y', 'import'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: [join(process.cwd(), 'tsconfig.json')],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    // Only uses Testing Library lint rules in test files
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
