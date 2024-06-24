import react from '@vitejs/plugin-react'
import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, mergeConfig } from 'vitest/config'

const localConfig = defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  test: {
    globals: true,
    setupFiles: ['vitest.setup.ts'],
    environment: 'happy-dom',
    coverage: {
      thresholds: {
        lines: 10,
        functions: 8,
        branches: 25,
        statements: 10,
        autoUpdate: false
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

export default mergeConfig(baseConfig, localConfig);