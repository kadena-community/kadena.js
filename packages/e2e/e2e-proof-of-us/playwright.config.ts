import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  timeout: 1800000,
  projects: [
    {
      name: 'proof-of-us',
      testDir: 'tests',
      use: {
        ...devices['iPhone 14 Pro Max'],
        defaultBrowserType: 'chromium',
        hasTouch: true,
        permissions: ['clipboard-read', 'clipboard-write'],
        launchOptions: {
          slowMo: 1000,
          args: [
            '--disable-web-security',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--use-file-for-fake-video-capture=./video.y4m',
          ],
        },
      },
    },
  ],
};

export default config;
