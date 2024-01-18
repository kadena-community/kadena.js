const { default: tsconfigPaths } = require('vite-tsconfig-paths');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    globals: false,
    coverage: {
      include: ['src/**'],
      exclude: ['**/tests/**', '**/integration-tests/**', '**/test/**'],
      enabled: true,
      provider: 'v8',
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
        autoUpdate: false
      },
    },
  },
});
