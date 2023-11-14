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
        lines: 92.46,
        functions: 86.48,
        branches: 95.45,
        statements: 92.46,
        thresholdAutoUpdate: true,
      },
    },
  }),
);
