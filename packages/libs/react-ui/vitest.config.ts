import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

const localConfig = defineConfig({
  plugins: [vanillaExtractPlugin({ emitCssInSsr: true }), react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    setupFiles: ['vitest.setup.ts'],
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 30.0,
        functions: 29.26,
        branches: 66.42,
        statements: 30.0,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
