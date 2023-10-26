const { default: tsconfigPaths } = require('vite-tsconfig-paths');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: false,
    coverage: {
      enabled: false, // It's enabled in CI (root package.json)
      provider: 'v8',
      thresholdAutoUpdate: false, // Should be enabled? Too precise though, annoying in CI if missed by 0.01%
    },
  },
});
