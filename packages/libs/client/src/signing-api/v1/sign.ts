import type { ICap } from '@kadena/types';

/**
 * Interface for the {@link https://github.com/kadena-io/KIPs/blob/master/kip-0015.md | `sign v1` API}
 * @public
 */
export interface ISignBody {
  code: string;
  caps: {
    role: string;
    description: string;
    cap: ICap;
  }[];
  data: Record<string, unknown>;
  sender: string;
  chainId: string;
  gasLimit: number;
  gasPrice: number;
  ttl: number;
  signingPubKey: string;
  networkId: string;
}
