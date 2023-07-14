import type { IKeyPair } from '@kadena/types';

import { binToHex } from './binToHex';

import nacl from 'tweetnacl';

/**
 * Generate a random ED25519 keypair.
 *
 * @alpha
 */
export function genKeyPair(): IKeyPair {
  const keyPair = nacl.sign.keyPair();
  const publicKey = binToHex(keyPair.publicKey);
  const secretKey = binToHex(keyPair.secretKey).slice(0, 64);
  return { publicKey, secretKey };
}
