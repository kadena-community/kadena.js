import type { PlaywrightTestConfig } from '@playwright/test';
import { join } from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const baseConfig: PlaywrightTestConfig = {
  testDir: join(__dirname, 'src/tests'),
  fullyParallel: true,
  forbidOnly: process.env.CI !== undefined,
  retries: process.env.CI !== undefined ? 1 : 0,
  workers: 1,
  reporter:
    process.env.CI !== undefined
      ? [['github'], ['dot'], ['html', { open: 'never' }]]
      : [['list'], ['html', { open: 'never' }]],
  use: {
    headless: process.env.CI !== undefined,
    baseURL: 'http://localhost:3000/',
    channel: 'chromium',
    trace: 'retain-on-failure',
  },
  timeout: 100000,

  expect: {
    timeout: 1 * 30000,
  },
};
