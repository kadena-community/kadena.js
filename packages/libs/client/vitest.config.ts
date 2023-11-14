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
        lines: 97.89,
        functions: 91.15,
        branches: 94.93,
        statements: 97.89,
        thresholdAutoUpdate: true,
      },
    },
  }),
);
