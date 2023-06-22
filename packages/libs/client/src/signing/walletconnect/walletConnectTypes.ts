import { ChainId, ISigningCap } from '@kadena/types';

import { IPactCommand } from '../../interfaces/IPactCommand';

/**
 * This is the interface for the signing request that is sent to the wallet.
 * It differs from the type in @kadena/types. When that is updated, we should
 * use that type instead.
 */
export interface ISigningRequest {
  code: string;
  data?: Record<string, unknown>;
  caps: ISigningCap[];
  nonce?: string;
  chainId?: ChainId;
  gasLimit?: number;
  gasPrice?: number;
  ttl?: number;
  sender?: string;
  extraSigners?: string[];
}

export interface IWalletConnectAccount {
  account: string;
  contracts?: string[];
  kadenaAccounts: [
    {
      name: string;
      chains: ChainId[];
      contract: string;
    },
  ];
}

export interface IAccount {
  walletConnectChainId: TWalletConnectChainId;
  network: IPactCommand['networkId']; // Kadena network (mainnet, testnet, devnet)
  account: string; // Kadena account
  chainId: ChainId; // Kadena ChainId
}

export type TSigningType = 'sign' | 'quicksign';

export type TWalletConnectChainId = `kadena:${IPactCommand['networkId']}`; //kadena:mainnet01, kadena:testnet04, kadena:development
