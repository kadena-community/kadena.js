import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      thresholds: {
        lines: 3.3,
        functions: 8.69,
        statements: 3.3,
        branches: 25,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
