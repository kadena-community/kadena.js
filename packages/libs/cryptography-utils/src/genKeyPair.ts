import type { IKeyPair } from '@kadena/types';
import nacl from 'tweetnacl';
import { binToHex } from './binToHex';

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
