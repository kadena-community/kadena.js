const fs = require('fs');
const path = require('path');

const findUp = (filename, dir = process.cwd()) => {
  const filePath = path.join(dir, filename);
  if (fs.existsSync(filePath)) return filePath;
  const parentDir = path.dirname(dir);
  if (parentDir === dir) return;
  return findUp(filename, parentDir);
};

const prettierOptions = JSON.parse(
  fs.readFileSync(findUp('.prettierrc'), 'utf8'),
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
    'json-files',
  ],
  rules: {
    '@kadena-dev/no-eslint-disable': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'prettier/prettier': ['warn', prettierOptions],
    'prefer-template': 'warn',
    'import/newline-after-import': 'error',
    'import/no-unresolved': 'error',
    'json-files/sort-package-json': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
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
