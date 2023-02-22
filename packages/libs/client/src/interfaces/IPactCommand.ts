/* eslint-disable */
import { ChainId, ChainwebNetworkId, ICap, ISignature } from '@kadena/types';

/**
 * @alpha
 */
export interface IPactCommand {
  code: string;
  data: Record<string, unknown>;
  publicMeta: IPublicMeta;
  networkId: Exclude<ChainwebNetworkId, undefined>;
  // signers: ISigner[];
  signers: {
    pubKey: string;
    caps: {
      name: string;
      args: ICap['args'];
    }[];
  }[];
  type: string;
  // eslint-disable-next-line @rushstack/no-new-null
  sigs: (ISignature | undefined | null)[];
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
