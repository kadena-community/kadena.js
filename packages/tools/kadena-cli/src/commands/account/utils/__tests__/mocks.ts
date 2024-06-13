import type { ChainId } from '@kadena/client';
import { testNetworkConfigMock } from '../../../../mocks/network.js';
import type { Predicate } from '../../types.js';

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
