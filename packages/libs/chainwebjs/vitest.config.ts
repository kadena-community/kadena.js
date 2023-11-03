import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        exclude: ['src/tests/**'], // This packages uses a non standard location for tests, explicitly ignoring them for code coverage
      },
    },
  }),
);
