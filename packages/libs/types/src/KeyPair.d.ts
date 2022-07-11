import type { Cap } from './PactCommand';

export interface KeyPair {
  publicKey: string;
  secretKey?: string;
  clist?: Array<Cap>;
}
