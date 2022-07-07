import type { ICap } from './PactCommand';

/**
 * @alpha
 */
export interface IKeyPair {
  publicKey: string;
  secretKey?: string;
  clist?: Array<ICap>;
}
