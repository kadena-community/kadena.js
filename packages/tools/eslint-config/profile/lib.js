const fs = require('fs');
const path = require('path');

/**
 * according to rush.json#projectFolderMin/MaxDepth packages specific to this
 * monorepo are always placed in 3rd nested directory
 * e.g. packages/{apps,libs,tools}/package-name/*
 */
const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../../.prettierrc'), 'utf8'),
);
/**
 * an alternative to above code is
 */
// const prettierrcPath = `${require('child_process')
//   .execSync('git rev-parse --show-toplevel')
//   .toString()
//   .replace(/\n/, '')}/.prettierrc`;

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
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules'],
      },
    },
  },
};
