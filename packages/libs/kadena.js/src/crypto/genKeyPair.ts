import type { KeyPair } from '../util';

import binToHex from './binToHex';

import nacl from 'tweetnacl';

/**
 * Generate a random ED25519 keypair.
 */
export default function genKeyPair(): KeyPair {
  const keyPair = nacl.sign.keyPair();
  const publicKey = binToHex(keyPair.publicKey);
  const secretKey = binToHex(keyPair.secretKey).slice(0, 64);
  return { publicKey, secretKey };
}
