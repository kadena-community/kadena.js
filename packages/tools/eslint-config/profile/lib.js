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
  },
};
