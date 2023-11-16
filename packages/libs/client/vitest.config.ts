import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      threads: false, // To prevent error in tests using jsdom environment: Module did not self-register: canvas.node
      exclude: ['src/**/*.int.test.ts'],
      coverage: {
        provider: 'v8',
        lines: 97.92,
        functions: 91.15,
        branches: 95.34,
        statements: 97.92,
        thresholdAutoUpdate: true,
      },
    },
  }),
);
