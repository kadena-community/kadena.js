import {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { ICap, ISignatureJson } from '@kadena/types';

import { NonceType, Type } from '../pact';
/**
 * @alpha
 */
export interface IPactCommand {
  type: Type;
  code: string;
  data: Record<string, unknown>;
  publicMeta: IPublicMeta;
  networkId: ChainwebNetworkId;
  // signers: ISigner[];
  signers: {
    pubKey: string;
    caps: {
      name: string;
      args: ICap['args'];
    }[];
  }[];
  sigs: (ISignatureJson | undefined)[];
  requestKey?: string;
  nonce?: NonceType;
}

/**
 * @alpha
 */
export interface IPublicMeta {
  chainId: ChainwebChainId;
  sender: string;
  gasLimit: number;
  gasPrice: number;
  ttl: number;
}

/**
 * @alpha
 */
export interface IContCommand {
  type: Type;
  data: Record<string, unknown>;
  publicMeta: IPublicMeta;
  networkId: ChainwebNetworkId;
  signers: {
    pubKey: string;
    caps: {
      name: string;
      args: ICap['args'];
    }[];
  }[];
  proof: string;
  pactId: string;
  step: number;
  rollback: boolean;
  nonce?: NonceType;
}
