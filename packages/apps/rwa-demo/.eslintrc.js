// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/next'],
  ignorePatterns: ['**/__generated__/**'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/heading-has-content': 'warn',
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',
    '@rushstack/no-new-null': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
  },
};
