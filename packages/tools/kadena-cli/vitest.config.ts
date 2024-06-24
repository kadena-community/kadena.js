import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  ...baseConfig,
  test: {
    include: ['src/**/*.test.ts'],
    setupFiles: ['./vitest.setup.js', './src/test-setup.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/mocks/**',
        'src/index.ts',
        'src/commands/devnet/**',
        '**/*.test-live.ts',
      ],
    },
  },
});
