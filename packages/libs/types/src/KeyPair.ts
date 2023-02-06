import type { ICap } from './PactCommand';

/**
 * A KeyPair always has a public key, with an optional secret key.
 * When the KeyPair is used in a Pact command, it may also have a list of capabilities.
 * @alpha
 */
export interface IKeyPair {
  publicKey: string;
  secretKey?: string;
  clist?: Array<ICap>;
}
