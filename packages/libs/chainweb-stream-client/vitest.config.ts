import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      thresholds: {
        lines: 16.29,
        functions: 40,
        branches: 68.57,
        statements: 16.29,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
