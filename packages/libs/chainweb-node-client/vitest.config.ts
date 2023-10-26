import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      globals: true,
      coverage: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
      },
    },
  }),
);
