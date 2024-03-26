import { runScript } from '@kadena/toolbox/script';
import pactVitePlugin from '@kadena/unplugin/vite';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    pactVitePlugin({
      onReady: async (client) => {
        const isDeployed = await client.isContractDeployed('free.hello-world');
        const s = await client.deployContract('hello-world.pact', {
          upgrade: isDeployed,
        });
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    testTimeout: 1000000,
    hookTimeout: 1000000,
    setupFiles: ['vitest.setup.ts'],
  },
});
