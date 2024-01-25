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
        lines: 18.64,
        functions: 23.71,
        branches: 43.58,
        statements: 18.64,
        autoUpdate: false,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
