import { SignCommand, Sig, SignedSig } from './SignCommand';
import { KeyPair, KeyPairPublicKey } from './KeyPair';
export function pullAndCheckHashs(sigs: SignCommand[]): string {
  var hsh = sigs[0].hash;
  for (var i = 1; i < sigs.length; i++) {
    if (sigs[i].hash !== hsh) {
      throw new Error(
        'Sigs for different hashes found: ' + JSON.stringify(sigs),
      );
    }
  }
  return hsh;
}

export function pullSig(s: SignCommand): Sig {
  return { sig: s.sig };
}

/**
 * Attach signature to hashed data
 * @param msg - some data to be passed to blake2b256.
 * @param keyPair - signing ED25519 keypair
 * @return {Array} of "hash", "sig" (signature in hex format), and "pubKey" public key values.
 */
export function attachSig(msg: string, kpArray: Array<KeyPair>): SignedSig {
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
