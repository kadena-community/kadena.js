import type { ChainId } from '@kadena/types';
import type { INetworkCreateOptions } from '../networks/utils/networkHelpers.js';

export type Predicate = 'keys-all' | 'keys-2' | 'keys-any';

export interface IAccountConfig {
  accountAlias: string;
  fungible: string;
  predicate: Predicate;
  network: string;
  chainId: ChainId;
  networkConfig: INetworkCreateOptions;
  quiet?: boolean;
  publicKeys?: string;
  publicKeysConfig: string[];
  accountOverwrite: boolean;
  accountDetailsFromChain?: IAccountDetailsResult;
}

export interface IAddAccountWalletConfig extends IAccountConfig {
  keyWallet: string;
}

export interface IAddAccountManualConfig extends IAccountConfig {
  accountName?: string;
}

export interface IGuard {
  keys: string[];
  pred: Predicate;
}

export interface IAccountDetailsResult {
  guard: IGuard;
  account: string;
  balance?: number;
}
