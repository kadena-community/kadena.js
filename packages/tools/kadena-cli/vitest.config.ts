import baseConfig from '@kadena-dev/shared-config/vitest.config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  baseConfig,
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
    setupFiles: ['./vitest.setup.js', './src/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    threads: false, // To prevent error in tests using jsdom environment: Module did not self-register: canvas.node
  },
});
