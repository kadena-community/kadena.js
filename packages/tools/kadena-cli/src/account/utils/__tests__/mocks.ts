import type { INetworkCreateOptions } from '../../../networks/utils/networkHelpers.js';
import type { IAddAccountConfig } from '../../types.js';

export const testNetworkConfigMock: INetworkCreateOptions = {
  networkHost: 'https://api.testnet.chainweb.com',
  networkExplorerUrl: 'https://explorer.chainweb.com/testnet04',
  networkId: 'testnet04',
  network: 'testnet',
};

export const devNetConfigMock: INetworkCreateOptions = {
  networkHost: 'https://localhost:8080',
  networkExplorerUrl: 'https://localhost:8080/explorer',
  networkId: 'development',
  network: 'devnet',
};

export const defaultConfigMock: IAddAccountConfig = {
  accountAlias: 'accountAlias',
  accountName: 'accountName',
  fungible: 'coin',
  publicKeysConfig: [],
  publicKeys: '',
  predicate: 'keys-all',
  chainId: '1',
  ...testNetworkConfigMock,
  networkConfig: testNetworkConfigMock,
  accountOverwrite: false,
};
