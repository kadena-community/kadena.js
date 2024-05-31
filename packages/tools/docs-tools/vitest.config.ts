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
          lines: 44.62,
          functions: 68.62,
          branches: 80.53,
          statements: 44.62,
        },
      },
    },
  }),
);
