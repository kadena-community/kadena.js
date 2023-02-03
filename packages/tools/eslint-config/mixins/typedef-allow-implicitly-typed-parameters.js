module.exports = {
  plugins: [],
  // The plugin documentation is here: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin
  overrides: [
    {
      // Declare an override that applies to TypeScript files only
      files: ['*.ts', '*.tsx'],

      rules: {
        '@typescript-eslint/typedef': [
          'warn',
          {
            arrayDestructuring: false,
            arrowParameter: false,
            memberVariableDeclaration: true,
            objectDestructuring: false,
            parameter: false,
            propertyDeclaration: true,
            variableDeclaration: false,
            variableDeclarationIgnoreFunction: true,
          },
        ],
      },
    },
  ],
};
