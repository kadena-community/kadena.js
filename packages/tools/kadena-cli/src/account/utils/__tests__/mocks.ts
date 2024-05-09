import type { ChainId } from '@kadena/client';
import type { INetworkCreateOptions } from '../../../networks/utils/networkHelpers.js';
import type { Predicate } from '../../types.js';

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

export const defaultConfigMock = {
  accountAlias: 'accountAlias',
  accountName: 'accountName',
  fungible: 'coin',
  publicKeysConfig: [],
  publicKeys: '',
  predicate: 'keys-all' as Predicate,
  chainId: '1' as ChainId,
  ...testNetworkConfigMock,
  networkConfig: testNetworkConfigMock,
  accountOverwrite: false,
};
