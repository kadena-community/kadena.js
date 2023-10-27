import type { IKeyPair } from '@kadena/types';
import nacl from 'tweetnacl';
import { binToHex } from './binToHex';
import { hexToBin } from './hexToBin';

/**
 * Generate a deterministic ED25519 keypair from a given Kadena secretKey
 *
 * @alpha
 */
export function restoreKeyPairFromSecretKey(seed: string): IKeyPair {
  if (seed.length !== 64) {
    throw new Error('Seed for IKeyPairgeneration has bad size');
  }
  const seedForNacl = hexToBin(seed);
  const keyPair = nacl.sign.keyPair.fromSeed(seedForNacl);
  const publicKey = binToHex(keyPair.publicKey);
  const secretKey = binToHex(keyPair.secretKey).slice(0, 64);
  return { publicKey, secretKey };
}
