module.exports = {
  root: true,
  extends: [
    'plugin:@next/next/recommended',
    './react',
    // TODO: temporarily disabled as it cannot be resolved by VSCode eslint
    // plugin. Packages need to add this themselves
    // 'next/core-web-vitals',
  ],
  plugins: ['import', 'simple-import-sort'],
};
