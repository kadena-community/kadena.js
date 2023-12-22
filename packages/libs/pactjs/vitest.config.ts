import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      thresholds: {
        lines: 87.17,
        statements: 87.17,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
