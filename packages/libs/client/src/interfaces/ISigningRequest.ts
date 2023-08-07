import { ISigningCap } from '@kadena/types';

import { IPactCommand } from './IPactCommand';

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
