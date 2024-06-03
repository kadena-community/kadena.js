import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  plugins: [vanillaExtractPlugin({ emitCssInSsr: true })],
  test: {
    setupFiles: ['vitest.setup.ts'],
    environment: 'happy-dom',
    coverage: {
      thresholds: {
        lines: 13.88,
        functions: 16.25,
        branches: 41.31,
        statements: 13.88,
        autoUpdate: false,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
