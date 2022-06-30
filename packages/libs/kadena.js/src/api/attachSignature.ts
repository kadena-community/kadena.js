import type {
  CommandPayloadStringifiedJSON,
  KeyPair,
  SignatureWithHash,
} from '@kadena/types';

import { base64UrlEncodeArr } from '../../../crypto/src/base64UrlEncodeArr';
import { hashBin } from '../../../crypto/src/hashBin';
import { sign } from '../../../crypto/src/sign';

/**
 * Attach signature to hashed data
 * @param msg - some data to be passed to blake2b256.
 * @param keyPair - signing ED25519 keypair
 * @return {Array} of "hash", "sig" (signature in hex format), and "pubKey" public key values.
 */
export function attachSignature(
  msg: CommandPayloadStringifiedJSON,
  keyPairs: Array<KeyPair>,
): Array<SignatureWithHash> {
  const hshBin = hashBin(msg);
  const hash = base64UrlEncodeArr(hshBin);
  if (keyPairs === []) {
    return [{ hash: hash, sig: undefined }];
  } else {
    return keyPairs.map((keyPair) => {
      if (
        Object.prototype.hasOwnProperty.call(keyPair, 'publicKey') &&
        keyPair.publicKey &&
        Object.prototype.hasOwnProperty.call(keyPair, 'secretKey') &&
        keyPair.secretKey
      ) {
        return sign(msg, keyPair);
      } else {
        return {
          hash: hash,
          sig: undefined,
          publicKey: keyPair.publicKey,
        };
      }
    });
  }
}
