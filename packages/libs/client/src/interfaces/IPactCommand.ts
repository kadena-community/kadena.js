import { ISigner } from "@kadena/types";

/**
 * @alpha
 */
export interface IPactCommand {
  code: string;
  data: Record<string, unknown>;
  publicMeta: IPublicMeta;
  networkId: string;
  signers: ISigner[];
  type: string;
}

/**
 * @alpha
 */
export interface IPublicMeta {
  chainId: string;
  sender: string;
  gasLimit: number;
  gasPrice: number;
  ttl: number;
}
