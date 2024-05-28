import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 97,
        functions: 100,
        branches: 84,
        statements: 97,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
