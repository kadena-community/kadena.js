import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const localConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.test.ts', 'src/interfaces/**/*'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 20.71,
        functions: 66.66,
        branches: 66.66,
        statements: 20.71,
      },
    },
  },
});

export default mergeConfig(baseConfig, localConfig);
