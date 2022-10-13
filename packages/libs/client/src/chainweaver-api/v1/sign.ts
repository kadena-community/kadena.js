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

export interface IChainweaverCapElement {
  role: string;
  description: string;
  cap: IChainweaverCap;
}

export interface IChainweaverCap {
  name: string;
  args: Array<number | string | Record<string, unknown>>;
}
