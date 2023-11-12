import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [vanillaExtractPlugin({ emitCssInSsr: true })],
    test: {
      setupFiles: ['vitest.setup.ts'],
      environment: 'happy-dom',
      threads: false,
      coverage: {
        provider: 'v8',
        lines: 77.77,
        functions: 45.45,
        branches: 74.68,
        statements: 77.77,
        thresholdAutoUpdate: true,
      },
    },
  }),
);
