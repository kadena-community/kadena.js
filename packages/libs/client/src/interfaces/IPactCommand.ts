import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { ChainId, ICap, ISignatureJson } from '@kadena/types';

import { NonceType } from '../pact';
/**
 * @alpha
 */
export interface IPactCommand {
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
  type: string;
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
