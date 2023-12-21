import { PlaywrightTestConfig } from '@playwright/test';
import { baseConfig } from './playwright.base.config';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: {
    command: `pnpm --filter @kadena/tools start`,
    url: 'http://localhost:3000',
    reuseExistingServer: process.env.CI === undefined,
    env: {
      FAUCET_NAMESPACE: 'n_34d947e2627143159ea73cdf277138fd571f17ac',
      FAUCET_CONTRACT: 'coin-faucet',
      FAUCET_USER: 'c:zWPXcVXoHwkNTzKhMU02u2tzN_yL6V3-XTEH1uJaVY4',
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: 'setup/faucet.setup.ts',
    },
    {
      name: 'tools',
      testDir: 'src/tests/tools-app/',
      dependencies: ['setup'],
      use: {
        storageState: './src/support/page-objects/tools-app/storageState.json',
      },
    },
  ],
};

export default config;
