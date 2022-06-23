module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  root: true,
  extends: [
    'google',
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort', 'prettier'],
  globals: {
    JSX: 'readonly',
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    camelcase: 'error',
    'import/no-cycle': 'error',
    'import/no-default-export': 'error',
    'import/no-duplicates': 'warn',
    'import/prefer-default-export': 'off',
    'new-cap': 'error',
    'no-case-declarations': 'error',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': 'error',
    'no-param-reassign': [
      'error',
      {
        props: true,
      },
    ],
    'no-redeclare': 'error',
    'no-unused-vars': 'error',
    'no-useless-escape': 'error',
    'prefer-const': 'error',
    'prettier/prettier': 'warn',
    'require-jsdoc': 'error',
    'valid-jsdoc': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // own packages.
          [`^(@kadena)(/.*|$)`],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
  },
  settings: {},
  overrides: [
    {
      files: ['**/stories.tsx', '**/*.stories.tsx'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
};
