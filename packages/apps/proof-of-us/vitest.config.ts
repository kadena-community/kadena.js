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
        lines: 82.24,
        functions: 48.38,
        branches: 75,
        statements: 82.24,
      },
    },
  },
});
export default mergeConfig(baseConfig, localConfig);
