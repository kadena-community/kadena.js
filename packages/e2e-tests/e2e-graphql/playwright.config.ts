import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: {
    command: `pnpm --filter @kadena/graph start`,
    url: 'http://localhost:4000/graphql',
    reuseExistingServer: process.env.CI === undefined,
  },
  projects: [
    {
      name: 'graph',
      testDir: 'tests/',
    },
  ],
};

export default config;
