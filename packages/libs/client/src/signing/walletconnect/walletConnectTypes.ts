import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { ISigningCap } from '@kadena/types';

import { IPactCommand } from '../../interfaces/IPactCommand';

/**
 * This is the interface for the signing request that is sent to the wallet.
 * It differs from the type in @kadena/types. When that is updated, we should
 * use that type instead.
 * @internal
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

/**
 * @internal
 */
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

/**
 * The Blockchain that's used WalletConnect context
 *
 * @remarks
 * For kadena it is `kadena:<networkId>`
 *
 * For reference see {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md#pairing-with-walletconnect | KIP-0017 WalletConnect Specification }
 * @public
 */
export type TWalletConnectChainId = `kadena:${IPactCommand['networkId']}`; //kadena:mainnet01, kadena:testnet04, kadena:development
