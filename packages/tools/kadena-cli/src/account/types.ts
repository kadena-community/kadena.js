import type { ChainId } from '@kadena/types';
import type { INetworkCreateOptions } from '../networks/utils/networkHelpers.js';

export type Predicate = 'keys-all' | 'keys-2' | 'keys-any';

export interface IAccountAliasFileConfig {
  accountName: string;
  fungible: string;
  publicKeysConfig: Array<string>;
  predicate: string;
}

export interface IAddAccountConfig extends IAccountAliasFileConfig {
  accountAlias: string;
}

export interface IValidateAccountDetailsConfig
  extends Omit<IAddAccountConfig, 'accountName'> {
  accountName?: string;
  chainId: ChainId;
  networkConfig: INetworkCreateOptions;
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
