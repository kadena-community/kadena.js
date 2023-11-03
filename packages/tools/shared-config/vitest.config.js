const { default: tsconfigPaths } = require('vite-tsconfig-paths');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: false,
    coverage: {
      enabled: true,
      provider: 'v8',
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
      thresholdAutoUpdate: false, // Should be enabled? Too precise though, annoying in CI if missed by 0.01%
    },
  },
});
