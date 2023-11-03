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
      coverage: {
        provider: 'v8',
        lines: 55.58,
        functions: 32.72,
        branches: 88.38,
        statements: 55.58,
        thresholdAutoUpdate: true,
      },
    },
  }),
);
