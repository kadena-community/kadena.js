module.exports = {
  root: true,
  extends: [
    '@rushstack/eslint-config/profile/node',
    // add when api-extractor is integrated
    // '@rushstack/eslint-config/mixins/tsdoc',
    // '@rushstack/eslint-config/mixins/friendly-locals',
    '../mixins/strict-boolean-expressions.js',
    '../mixins/import-no-duplicates.js',
    '../mixins/simple-import-sort.js',
    '../mixins/typedef-allow-implicitly-typed-parameters.js',
  ],
  plugins: ['@kadena-dev/eslint-plugin', 'import', 'simple-import-sort'],
  rules: {
    '@kadena-dev/no-eslint-disable': 'error',
    'prefer-template': 'warn',
    'import/newline-after-import': 'error',
    'import/no-unresolved': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        // Rush uses `path.resolve('tsconfig.json')` to resolve each TS config separately, but in VS Code ESLint we
        // want to the next glob to resolve them all. So we use this in `.vscode/settings.json` instead:
        // project: 'packages/*/*/tsconfig.json',
      },
    },
  },
};
