import type { INetworkCreateOptions } from '../commands/networks/utils/networkHelpers.js';

export const testNetworkConfigMock: INetworkCreateOptions = {
  networkHost: 'https://api.testnet.chainweb.com',
  networkExplorerUrl: 'https://explorer.chainweb.com/testnet04',
  networkId: 'testnet04',
  network: 'testnet',
};

export const devNetConfigMock: INetworkCreateOptions = {
  networkHost: 'http://localhost:8080',
  networkExplorerUrl: 'http://localhost:8080/explorer',
  networkId: 'development',
  network: 'devnet',
};
