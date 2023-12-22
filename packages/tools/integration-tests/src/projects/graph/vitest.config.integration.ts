const { default: tsconfigPaths } = require('vite-tsconfig-paths');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  plugins: [tsconfigPaths({ projects: ['../../../tsconfig.json'] })],
  test: {
    name: '@kadena/graph',
    include: ['tests/**/*.{test,spec}.ts'],
    globals: true,
    testTimeout: 1200000,
    hookTimeout: 30000,
  },
});
