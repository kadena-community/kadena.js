import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [vanillaExtractPlugin({ emitCssInSsr: true })],
    test: {
      setupFiles: ['vitest.setup.ts'],
      globals: true,
      environment: 'happy-dom',
      threads: false,
      coverage: {
        lines: 70,
        functions: 40,
        branches: 80,
        statements: 70,
      },
    },
  }),
);
