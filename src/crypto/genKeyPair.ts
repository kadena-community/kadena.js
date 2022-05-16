import nacl from 'tweetnacl';
import binToHex from './binToHex';
import { KeyPair } from '../util';

/**
 * Generate a random ED25519 keypair.
 */
export default function genKeyPair(): KeyPair {
  const keyPair = nacl.sign.keyPair();
  const publicKey = binToHex(keyPair.publicKey);
  const secretKey = binToHex(keyPair.secretKey).slice(0, 64);
  return { publicKey, secretKey };
}
