import { type ChainwebChainId } from '@kadena/chainweb-node-client';

import { type IPactCommand } from '../../interfaces/IPactCommand';

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
 * The Blockchain that's used in a WalletConnect context
 *
 * @remarks
 * For kadena it is `kadena:<networkId>`
 *
 * @see Reference {@link https://github.com/kadena-io/KIPs/blob/master/kip-0017.md#pairing-with-walletconnect | KIP-0017 WalletConnect Specification }
 * @public
 */
export type TWalletConnectChainId = `kadena:${IPactCommand['networkId']}`; //kadena:mainnet01, kadena:testnet04, kadena:development
