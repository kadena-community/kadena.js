module.exports = {
  root: true,
  extends: ['./lib', 'next/core-web-vitals'],
  plugins: ['import', 'simple-import-sort', 'react'],
  rules: {
    '@rushstack/typedef-var': 'off',
    // @kadena-dev/typedef-var allows for inferred types in exported constants
    //  when they are created by a function call.
    //  e.g. This is allowed: `export const StyledButton = styled('button', {})`
    '@kadena-dev/typedef-var': 'warn',
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
  },

  // rules: {
  //   '@typescript-eslint/explicit-function-return-type': {
  //     allowExpressions: true,
  //   }
  // }
};
