import {
  createDevNetNetworkConfig,
  createLocalNetworkConfig,
  createTestNetNetworkConfig,
  defineConfig,
} from './src/config';

export default defineConfig({
  defaultNetwork: 'local',
  networks: {
    local: createLocalNetworkConfig(),
    devnet: createDevNetNetworkConfig({}),
    testnet: createTestNetNetworkConfig(),
  },

  $production: {
    defaultNetwork: 'testnet',
  },
});
