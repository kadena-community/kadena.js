// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/lib'],
  ignorePatterns: ['vitest.integration.config.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['./integration-tests/**/*.ts', './integration-tests/**/*.ts'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.test.json'], // Specify it only for TypeScript files
      },
    },
  ],
};
