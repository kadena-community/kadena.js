import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 50000,
    include: ['tests/*.test.ts'],
    globals: true,
    threads: false, // To prevent error in tests using jsdom environment: Module did not self-register: canvas.node
  },
});
