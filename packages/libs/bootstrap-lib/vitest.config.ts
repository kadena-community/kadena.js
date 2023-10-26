import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  }),
);
