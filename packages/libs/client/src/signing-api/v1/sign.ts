/**
 * @alpha
 */
export interface IChainweaverSignBody {
  code: string;
  caps: IChainweaverCapElement[];
  data: Record<string, unknown>;
  sender: string;
  chainId: string;
  gasLimit: number;
  gasPrice: number;
  ttl: number;
  signingPubKey: string;
  networkId: string;
}

/**
 * @alpha
 */
export interface IChainweaverCapElement {
  role: string;
  description: string;
  cap: IChainweaverCap;
}

/**
 * @alpha
 */
export interface IChainweaverCap {
  name: string;
  args: Array<number | string | Record<string, unknown>>;
}
