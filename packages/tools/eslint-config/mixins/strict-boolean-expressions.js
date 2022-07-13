module.exports = {
  // The plugin documentation is here: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin
  overrides: [
    {
      // Declare an override that applies to TypeScript files only
      files: ['*.ts', '*.tsx'],

      rules: {
        '@typescript-eslint/strict-boolean-expressions': 'warn',
      },
    },
  ],
};
