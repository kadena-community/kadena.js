const { default: tsconfigPaths } = require('vite-tsconfig-paths');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  plugins: [tsconfigPaths({ projects: ['../../../tsconfig.json'] })],
  test: {
    name: '@kadena/graph',
    include: ['tests/**/*.{test,spec}.ts'],
    setupFiles: ['/testdata/setup/devnet-state.ts'],
    globals: false,
    testTimeout: 60000,
  },
});
