import { ChainId, IKdaMethodMap } from '@kadena/wallet-adapter-core';

export interface KadenaGetAccountsRequest {
  method: 'kadena_getAccounts_v1';
  params: {
    accounts: {
      account: string;
      contracts?: string[];
    }[];
  };
}
export interface KadenaGetAccountsResponse {
  accounts: {
    account: string;
    publicKey: string;
    kadenaAccounts: {
      name: string;
      contract: string;
      chains: ChainId[];
    }[];
  }[];
}

/**
 * Represents the extended method map specific to Ecko Wallet.
 *
 * Contains custom methods specific to Ecko Wallet, such as a custom checkStatus.
 *
 * @public
 */
export interface IWalletConnectMethodMap {
  //
}

/**
 * ExtendedMethodMap combines the standard KdaMethodMap with Ecko-specific methods.
 *
 * @public
 */
export type ExtendedMethodMap = IKdaMethodMap & IWalletConnectMethodMap;

/**
 * ExtendedMethod represents the keys of the ExtendedMethodMap.
 *
 * @public
 */
export type ExtendedMethod = keyof ExtendedMethodMap;
