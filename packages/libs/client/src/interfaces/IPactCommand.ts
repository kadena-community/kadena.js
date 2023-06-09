import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { ChainId, ICap, ISignatureJson, Type } from '@kadena/types';

import { NonceType } from '../pact';
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
  chainId: ChainId;
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
