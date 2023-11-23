const { default: tsconfigPaths } = require('vite-tsconfig-paths');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    include: ['integration-tests/*.int.{test,spec}.{ts,tsx}'],
    globals: false,
  },
});
