import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        lines: 98.45,
        functions: 100,
        branches: 84.84,
        statements: 98.45,
        thresholdAutoUpdate: true,
      },
    },
  }),
);
