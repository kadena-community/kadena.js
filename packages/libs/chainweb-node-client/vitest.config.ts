import baseConfig  from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 98.45,
        functions: 100,
        branches: 84.84,
        statements: 98.45,
        autoUpdate: true,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
