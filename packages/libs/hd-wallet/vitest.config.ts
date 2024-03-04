import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30000, //TODO: this should be investigated and reduced
    include: ['src/**/*.test.ts'],
    setupFiles: './vitest.setup.js',
  },
});
