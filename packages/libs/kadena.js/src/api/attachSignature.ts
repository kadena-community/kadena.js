import hashBin from '../crypto/hashBin';
import base64UrlEncodeArr from '../crypto/base64UrlEncodeArr';
import sign from '../crypto/sign';
import {
  SignatureWithHash,
  KeyPair,
  CommandPayloadStringifiedJSON,
} from '../util';

/**
 * Attach signature to hashed data
 * @param msg - some data to be passed to blake2b256.
 * @param keyPair - signing ED25519 keypair
 * @return {Array} of "hash", "sig" (signature in hex format), and "pubKey" public key values.
 */
export default function attachSignature(
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
        keyPair.hasOwnProperty('publicKey') &&
        keyPair.publicKey &&
        keyPair.hasOwnProperty('secretKey') &&
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
