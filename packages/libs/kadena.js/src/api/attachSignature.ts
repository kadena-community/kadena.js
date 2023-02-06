import { hash, sign } from '@kadena/cryptography-utils';
import type {
  CommandPayloadStringifiedJSON,
  IKeyPair,
  SignatureWithHash,
} from '@kadena/types';

/**
 * Attach signature to hashed data
 * @param msg - some data to be passed to blake2b256.
 * @param keyPair - signing ED25519 keypair
 * @return {Array} of "hash", "sig" (signature in hex format), and "pubKey" public key values.
 */
export function attachSignature(
  msg: CommandPayloadStringifiedJSON,
  keyPairs: Array<IKeyPair>,
): Array<SignatureWithHash> {
  const h = hash(msg);
  if (!keyPairs.length) {
    return [{ hash: h, sig: undefined }];
  } else {
    return keyPairs.map((keyPair) => {
      if (
        Object.prototype.hasOwnProperty.call(keyPair, 'publicKey') &&
        keyPair.publicKey !== undefined &&
        Object.prototype.hasOwnProperty.call(keyPair, 'secretKey') &&
        keyPair.secretKey !== undefined
      ) {
        return sign(msg, keyPair);
      } else {
        return {
          hash: h,
          sig: undefined,
          publicKey: keyPair.publicKey,
        };
      }
    });
  }
}
