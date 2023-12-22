import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  plugins: [vanillaExtractPlugin({ emitCssInSsr: true })],
  test: {
    setupFiles: ['vitest.setup.ts'],
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 30.63,
        functions: 29.61,
        branches: 66.78,
        statements: 30.63,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
