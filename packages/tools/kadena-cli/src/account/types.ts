import type { ChainId } from '@kadena/types';
import type { INetworkCreateOptions } from '../networks/utils/networkHelpers.js';

export type Predicate = 'keys-all' | 'keys-2' | 'keys-any';

export interface IAddAccountConfig {
  accountAlias: string;
  fungible: string;
  predicate: string;
  network: string;
  chainId: ChainId;
  networkConfig: INetworkCreateOptions;
  quiet?: boolean;
  publicKeys?: string;
  publicKeysConfig: string[];
  accountOverwrite: boolean;
  accountDetailsFromChain?: IAccountDetailsResult;
  accountName: string;
}

export interface IValidateAccountDetailsConfig
  extends Omit<IAddAccountConfig, 'accountName'> {
  accountName?: string;
}

export interface IGuard {
  keys: string[];
  pred: string;
}

export interface IAccountDetailsResult {
  guard: IGuard;
  account: string;
  balance:
    | number
    | {
        decimal: number;
      };
}

export interface IAliasAccountData {
  name: string;
  fungible: string;
  publicKeys: string[];
  predicate: string;
  alias: string;
}
