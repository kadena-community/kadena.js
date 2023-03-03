/** @type {{compilerOptions: {paths: {[alias:string]: string}}}} */
let tsconfig = undefined;
try {
  tsconfig = require('./tsconfig.json');
} catch (error) {
  // Ignore
}

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
              // Aliases from tsconfig.json
              ...(tsconfig?.compilerOptions?.paths
                ? Object.keys(tsconfig.compilerOptions.paths).map((alias) => [
                    `^${alias}(/.*|$)`,
                  ])
                : []),
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
