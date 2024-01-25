import type { PlaywrightTestConfig } from '@playwright/test';
import { baseConfig } from './playwright.base.config';

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
      testDir: 'src/tests/graph/',
    },
  ],
};

export default config;
