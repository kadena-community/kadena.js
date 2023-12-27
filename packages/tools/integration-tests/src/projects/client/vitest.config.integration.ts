const { default: tsconfigPaths } = require('vite-tsconfig-paths');
import { defineProject } from "vitest/config";

module.exports = defineProject({
  plugins: [tsconfigPaths({ projects: ['../../../tsconfig.json'] })],
  test: {
    name: '@kadena/client',
    include: ['tests/**/*.{test,spec}.ts'],
    globals: false,
    testTimeout: 1200000,
    hookTimeout: 30000,
  },
});
