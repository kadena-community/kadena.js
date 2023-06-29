const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../../.prettierrc'), 'utf8'),
);

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
  plugins: [
    '@kadena-dev/eslint-plugin',
    'import',
    'simple-import-sort',
    'prettier',
  ],
  rules: {
    '@kadena-dev/no-eslint-disable': 'error',
    'prettier/prettier': ['warn', prettierOptions],
    'prefer-template': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-unresolved': [
      'warn',
      {
        ignore: ['^@/'], // Ignore custom paths starting with '@/'
      },
    ],
  },
};
