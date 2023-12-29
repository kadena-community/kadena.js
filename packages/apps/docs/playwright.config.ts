import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: 'src/tests/*',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 1,
  reporter: [['github'], ['list'], ['html', { open: 'never' }]],
  use: {
    headless: process.env.CI != undefined,
    baseURL: 'http://localhost:3000/',
    channel: 'chromium',
    trace: 'retain-on-failure',
  },
  expect: {
    timeout: 10 * 1000,
  },
  webServer: {
    command: `pnpm run start`,
    url: 'http://127.0.0.1:3000/',
    reuseExistingServer: process.env.CI === undefined,
  },
  projects: [
    {
      name: 'docs',
      testDir: 'src/tests/',
    },
  ],
});
