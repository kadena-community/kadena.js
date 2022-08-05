module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@next/next/recommended',
    'airbnb-typescript',
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array
  ],
  plugins: [
    'unused-imports'
  ],
  env: {
    browser: true,
    jest: true
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2016, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    "react/require-default-props": 0,
    "react/forbid-prop-types": 0,
    "react/display-name": 0,
    "jsx-a11y/alt-text": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/label-has-associated-control": 0,
    'jsx-a11y/no-autofocus': 0,
    'prefer-template': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/prop-types': 0,
    'unused-imports/no-unused-imports-ts': 2,
    'react/state-in-constructor': 2,
    'react/no-array-index-key': 0,
    'react/no-did-update-set-state': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-curly-brace-presence': 0,
    'react/jsx-no-target-blank': 0,
    'react/jsx-props-no-spreading': 0,
    'no-nested-ternary': 0,
    'no-bitwise': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'class-methods-use-this': 0,
    'no-param-reassign': 0,
    'no-return-await': 0,
    'no-console': 0,
    'consistent-return': 0,
    'import/no-cycle': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'import/no-default-export': 0,
    'prefer-destructuring': 0,
    'radix': 0,
    'react/no-access-state-in-setstate': 0,
    // unused-imports
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    'unused-imports/no-unused-vars': 0,
  },
  root: true,
  ignorePatterns: [
    '.eslintrc.js',
  ],
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
