import type { KeyPair } from '../util';

import binToHex from './binToHex';
import hexToBin from './hexToBin';

import nacl from 'tweetnacl';

/**
 * Generate a deterministic ED25519 keypair from a given Kadena secretKey
 */
export default function restoreKeyPairFromSecretKey(seed: string): KeyPair {
  if (seed.length !== 64) {
    throw new Error('Seed for KeyPair generation has bad size');
  }
  const seedForNacl = hexToBin(seed);
  const keyPair = nacl.sign.keyPair.fromSeed(seedForNacl);
  const publicKey = binToHex(keyPair.publicKey);
  const secretKey = binToHex(keyPair.secretKey).slice(0, 64);
  return { publicKey, secretKey };
}
