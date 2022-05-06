import nacl from 'tweetnacl';
import binToHex from './binToHex';
import hexToBin from './hexToBin';
import { KeyPair } from '../util';

/**
 * Generate a deterministic ED25519 keypair from a given Kadena secretKey
 */
export default function restoreKeyPairFromSecretKey(seed: string): KeyPair {
  if (!seed) throw new Error(`seed for KeyPair generation not provided`);
  if (seed.length !== 64)
    throw new Error('Seed for KeyPair generation has bad size');
  var seedForNacl = hexToBin(seed);
  var kp = nacl.sign.keyPair.fromSeed(seedForNacl);
  var pubKey = binToHex(kp.publicKey);
  var secKey = binToHex(kp.secretKey).slice(0, 64);
  return { publicKey: pubKey, secretKey: secKey };
}
