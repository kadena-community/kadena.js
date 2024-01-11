import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 86.31,
        functions: 80,
        branches: 87.5,
        statements: 86.31,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
