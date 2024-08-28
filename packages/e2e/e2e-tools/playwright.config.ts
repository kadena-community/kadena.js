import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  reporter:
    process.env.CI !== undefined
      ? [['list'], ['blob', { outoutputFile: './blob-report/blob-tools.zip' }]]
      : [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: `pnpm --filter @kadena/tools start`,
    url: 'http://localhost:3000',
    reuseExistingServer: process.env.CI === undefined,
  },
  projects: [
    {
      name: 'setup',
      testDir: 'setup',
      testMatch: 'devnet.setup.ts',
    },
    {
      name: 'tools',
      testDir: 'tests',
      dependencies: ['setup'],
      use: {
        storageState: './setup/storageState.json',
      },
    },
  ],
};

export default config;
