import nacl from 'tweetnacl';
import binToHex from './binToHex';
import { KeyPair } from '../util';

/**
 * Generate a random ED25519 keypair.
 */
export default function genKeyPair(): KeyPair {
  var keyPair = nacl.sign.keyPair();
  var publicKey = binToHex(keyPair.publicKey);
  var secretKey = binToHex(keyPair.secretKey).slice(0, 64);
  return { publicKey: publicKey, secretKey: secretKey };
}
