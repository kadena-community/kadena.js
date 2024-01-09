import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      thresholds: {
        lines: 16.16,
        functions: 38.46,
        statements: 16.16,
        branches: 71.42,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
