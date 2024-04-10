import { baseConfig } from '@kadena-dev/e2e-base/playwright.config';
import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  timeout: 180000,
  projects: [
    {
      name: 'proof-of-us',
      testDir: 'tests',
    
      use: {
        video: 'on',
        ...devices['iPhone 14 Pro Max'],
        // viewport: { width: 393, height: 852 },
        // deviceScaleFactor: 3,
        // isMobile: true,
        // hasTouch: true,
        defaultBrowserType: 'chromium',
        permissions: ["clipboard-read", "clipboard-write"],
        launchOptions: {
          slowMo: 1000,
          args: [
            '--disable-web-security',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--use-file-for-fake-video-capture=./video.y4m'
          ],
        },
      },
    },
  ],
};

export default config;
