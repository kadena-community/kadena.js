import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { ChainId, ICap, ISignatureJson } from '@kadena/types';
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
