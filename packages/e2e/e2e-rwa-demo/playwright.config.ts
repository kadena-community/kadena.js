import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';
import { defineConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  reporter:
    process.env.CI !== undefined
      ? [['list'], ['blob', { outoutputFile: './blob-report/blob-tools.zip' }]]
      : [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: `pnpm --filter @kadena/rwa-demo start`,
    reuseExistingServer: !process.env.CI,
  },
  timeout: 180 * 1000,
  use: {
    headless: process.env.CI !== undefined,
    baseURL: 'http://localhost:3000/',
    channel: 'chromium',
    trace: 'retain-on-failure',
    viewport: { width: 1080, height: 800 },
    testIdAttribute: 'data-testid',
  },
  projects: [
    // {
    //   name: 'setup',
    //   testDir: 'setup',
    //   testMatch: 'devnet.setup.ts',
    // },
    {
      name: 'rwa',
      testDir: 'tests',
    },
  ],
};

export default defineConfig(config);
