import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  test: {
    globals: true,
    setupFiles: ['vitest.setup.ts'],
    environment: 'happy-dom',
    coverage: {
      thresholds: {
        lines: 9,
        functions: 8,
        branches: 22,
        statements: 9,
        autoUpdate: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
