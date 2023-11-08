import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        lines: 92.21,
        functions: 60,
        branches: 80,
        statements: 92.21,
        thresholdAutoUpdate: true,
      },
    },
  }),
);
