module.exports = {
  root: true,
  extends: ['./lib', 'plugin:react/recommended'],
  plugins: ['import', 'simple-import-sort', 'react'],
  rules: {
    '@rushstack/typedef-var': 'off',
    // @kadena-dev/typedef-var allows for inferred types in exported constants
    //  when they are created by a function call.
    //  e.g. This is allowed: `export const StyledButton = styled('button', {})`
    '@kadena-dev/typedef-var': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
