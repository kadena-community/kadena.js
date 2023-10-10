import { defaultConfig } from '@kadena-dev/heft-rig/playwright.config.base';
import { defineConfig } from "@playwright/test";

process.env.FAUCET_PUBLIC_KEY = "782127638ab9cc8fa8598ff0120464ceef6f367ddcd616b47afffbdb175dcc5e";
process.env.FAUCET_PRIVATE_KEY = "93fd78bd1e79a3b593d4732b76050b418aeefa5e4e6ea80f351b4c3a5b0dd19f";


export default defineConfig({
    ...defaultConfig,
    webServer: {
      command: 'pnpm dev',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: false,
      stdout: 'ignore',
      stderr: 'pipe',
      env: {
        FAUCET_PUBLIC_KEY: "782127638ab9cc8fa8598ff0120464ceef6f367ddcd616b47afffbdb175dcc5e",
        FAUCET_PRIVATE_KEY: "93fd78bd1e79a3b593d4732b76050b418aeefa5e4e6ea80f351b4c3a5b0dd19f"
      }
    }
  }
);
