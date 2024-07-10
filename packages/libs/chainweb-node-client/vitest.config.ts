import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 96.03,
        functions: 100,
        branches: 81,
        statements: 96.03,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
