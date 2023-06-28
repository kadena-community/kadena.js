const fs = require('fs');

const prettierOptions = JSON.parse(fs.readFileSync('./.prettierrc', 'utf8'));
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  plugins: ['prettier', 'jest'],
  extends: ['next/core-web-vitals', '@kadena-dev/eslint-config/profile/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  ignorePatterns: ['**/*.spec.ts', '**/*.spec.tsx', '**/generated/**'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    '@typescript-eslint/strict-boolean-expressions': 0,
    'arrow-body-style': [2, 'as-needed'],
    'comma-dangle': [2, 'always-multiline'],
    'prefer-template': 2,
    'import/newline-after-import': 1,
    'import/no-unresolved': 2,
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/heading-has-content': 1,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
  },
};
