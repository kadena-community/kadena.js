import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      thresholds: {
        lines: 15.3,
        functions: 38.46,
        statements: 15.3,
        branches: 71.42,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
