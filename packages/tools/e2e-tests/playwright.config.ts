import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: 'tests/*',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 1,
  reporter: [['github'], ['list'], ['html', { open: 'never' }]],
  use: {
    headless: !!process.env.CI,
    baseURL: process.env.PLAYWRIGHT_BASE_URL
      ? process.env.PLAYWRIGHT_BASE_URL
      : 'http://127.0.0.1:3000',
    channel: 'chromium',
    trace: `retain-on-failure`,
  },
  expect: {
    timeout: 10 * 1000,
  },
  projects: [
    {
      name: 'tools-app',
      testDir: 'tests/tools-app',
    },
  ],
});
