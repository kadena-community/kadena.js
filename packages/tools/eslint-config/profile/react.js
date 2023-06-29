module.exports = {
  root: true,
  extends: ['./lib', 'plugin:react/recommended'],
  plugins: ['import', 'simple-import-sort', 'react', 'jsx-a11y'],
  rules: {
    '@rushstack/typedef-var': 'off',
    // @kadena-dev/typedef-var allows for inferred types in exported constants
    //  when they are created by a function call.
    //  e.g. This is allowed: `export const StyledButton = styled('button', {})`
    '@kadena-dev/typedef-var': 'warn',
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/heading-has-content': 'warn',
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',
    'react/function-component-definition': [
      'warn',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  // turned off boolean expressions for jsx and tsx files, so we can have non-boolean statements in react components
  // this rule should be enabled for js and ts files even in a ReactJS or NextJS setup
  overrides: [
    {
      files: ['*.jsx', '*.tsx'],
      rules: {
        '@typescript-eslint/strict-boolean-expressions': 'off',
      },
    },
  ],

  // rules: {
  //   '@typescript-eslint/explicit-function-return-type': {
  //     allowExpressions: true,
  //   }
  // }
};
