import hashBin from '../crypto/hashBin';
import base64UrlEncodeArr from '../crypto/base64UrlEncodeArr';
import sign from '../crypto/sign';
import { SignCommand, Sig, KeyPair } from '../util';

/**
 * Attach signature to hashed data
 * @param msg - some data to be passed to blake2b256.
 * @param keyPair - signing ED25519 keypair
 * @return {Array} of "hash", "sig" (signature in hex format), and "pubKey" public key values.
 */
export function attachSig(
  msg: string,
  kpArray: Array<KeyPair>,
): Array<SignCommand> {
  var hshBin = hashBin(msg);
  var hsh = base64UrlEncodeArr(hshBin);
  if (kpArray === []) {
    return [{ hash: hsh, sig: undefined }];
  } else {
    return kpArray.map((kp) => {
      if (
        kp.hasOwnProperty('publicKey') &&
        kp.publicKey &&
        kp.hasOwnProperty('secretKey') &&
        kp.secretKey
      ) {
        return sign(msg, kp);
      } else {
        return {
          hash: hsh,
          sig: undefined,
          publicKey: kp.publicKey,
        };
      }
    });
  }
}
