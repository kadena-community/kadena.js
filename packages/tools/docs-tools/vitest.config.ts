import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      globals: true,
      setupFiles: ['vitest.setup.ts'],
      environment: 'happy-dom',
      threads: false,
      coverage: {
        provider: 'v8',
        thresholds: {
          lines: 26.02,
          functions: 60,
          branches: 74.68,
          statements: 26.02,
        },
      },
    },
  }),
);
