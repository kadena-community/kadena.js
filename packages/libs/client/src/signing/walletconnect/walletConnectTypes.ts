import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { ISigningCap } from '@kadena/types';

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
  chainId?: ChainwebChainId;
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
      chains: ChainwebChainId[];
      contract: string;
    },
  ];
}

export interface IAccount {
  walletConnectChainId: TWalletConnectChainId;
  network: IPactCommand['networkId']; // Kadena network (mainnet, testnet, devnet)
  account: string; // Kadena account
  chainId: ChainwebChainId; // Kadena ChainId
}

export type TSigningType = 'sign' | 'quicksign';

export type TWalletConnectChainId = `kadena:${IPactCommand['networkId']}`; //kadena:mainnet01, kadena:testnet04, kadena:development
