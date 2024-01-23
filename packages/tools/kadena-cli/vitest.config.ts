import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  baseConfig,
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
    setupFiles: ['./vitest.setup.js', './src/setup.ts'],
    threads: false, // To prevent error in tests using jsdom environment: Module did not self-register: canvas.node
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
      include: ['src/**/*.ts'],
      exclude: ['**/mocks/**'],
    },
  },
});
