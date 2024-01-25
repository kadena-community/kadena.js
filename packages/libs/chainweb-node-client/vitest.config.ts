import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 98.29,
        functions: 100,
        branches: 84.37,
        statements: 98.29,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
