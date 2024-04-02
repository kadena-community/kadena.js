import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: {
    // we explicitly use the start command here because docs dev is seriously slow.
    command: `pnpm --filter @kadena/docs start`,
    url: 'http://localhost:3000',
    reuseExistingServer: process.env.CI === undefined,
    stdout: 'ignore',
    stderr: 'ignore',
  },
  projects: [
    {
      name: 'docs',
      testDir: 'tests',
    },
  ],
};

export default config;
