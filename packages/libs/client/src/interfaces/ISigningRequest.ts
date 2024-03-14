import type { ISigningCap } from '@kadena/types';
import type { IPactCommand } from './IPactCommand';

/**
 * @alpha
 */
export interface ISigningRequest {
  code: string;
  data?: Record<string, unknown>;
  caps: ISigningCap[];
  nonce?: string;
  chainId?: IPactCommand['meta']['chainId'];
  gasLimit?: number;
  gasPrice?: number;
  ttl?: number;
  sender?: string;
  extraSigners?: string[];
}
