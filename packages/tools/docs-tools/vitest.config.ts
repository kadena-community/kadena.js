import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      setupFiles: ['vitest.setup.ts'],
      environment: 'happy-dom',
      threads: false,
      coverage: {
        exclude: ['src/mock/**'],
        provider: 'v8',
        lines: 40,
        functions: 40,
        branches: 40,
        statements: 40,
      },
    },
  }),
);
