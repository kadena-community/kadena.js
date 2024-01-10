import type { PlaywrightTestConfig } from '@playwright/test';
import { baseConfig } from './playwright.base.config';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: {
    command: `pnpm --filter @kadena/tools dev`,
    url: 'http://localhost:3000',
    reuseExistingServer: process.env.CI === undefined,
    env: {
      FAUCET_PUBLIC_KEY:
        '782127638ab9cc8fa8598ff0120464ceef6f367ddcd616b47afffbdb175dcc5e',
      FAUCET_PRIVATE_KEY:
        '93fd78bd1e79a3b593d4732b76050b418aeefa5e4e6ea80f351b4c3a5b0dd19f',
    },
  },
  projects: [
    {
      name: 'tools',
      testDir: 'src/tests/tools-app/',
    },
  ],
};

export default config;
