import baseConfig  from '@kadena-dev/shared-config/vitest.config';
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
        lines: 50,
        functions: 30,
        branches: 80,
        statements: 50,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
