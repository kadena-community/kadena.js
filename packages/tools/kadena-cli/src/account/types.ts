import type { ChainId } from '@kadena/types';
import type { INetworkCreateOptions } from '../networks/utils/networkHelpers.js';

export type Predicate = 'keys-all' | 'keys-2' | 'keys-any';

export interface IAddAccountManualConfig extends INetworkCreateOptions {
  accountAlias: string;
  accountName?: string;
  fungible: string;
  predicate: Predicate;
  chainId: ChainId;
  publicKeysConfig: string[];
  networkConfig: INetworkCreateOptions;
}
