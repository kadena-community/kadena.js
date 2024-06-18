import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react'

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [react(), vanillaExtractPlugin()],
    test: {
      globals: true,
      globalSetup: './vitest-globals.ts',
      setupFiles: ['vitest.setup.ts'],
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        thresholds: {
          lines: 10,
          functions: 8,
          branches: 30,
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
)