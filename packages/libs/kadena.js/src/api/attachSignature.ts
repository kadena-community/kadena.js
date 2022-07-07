import { base64UrlEncodeArr, hashBin, sign } from '@kadena/crypto';
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
  const hshBin = hashBin(msg);
  const hash = base64UrlEncodeArr(hshBin);
  if (!keyPairs.length) {
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
