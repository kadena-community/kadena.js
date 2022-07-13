module.exports = {
  // The plugin documentation is here:
  overrides: [
    {
      // Declare an override that applies to TypeScript files only
      files: ['*.ts', '*.tsx'],

      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Side effect imports.
              ['^\\u0000'],
              // Internal packages.
              ['^@kadena(/.*|$)'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ],
          },
        ],
      },
    },
  ],
};
