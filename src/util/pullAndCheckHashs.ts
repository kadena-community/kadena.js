import hashBin from '../crypto/hashBin';
import base64UrlEncodeArr from '../crypto/base64UrlEncodeArr';
import sign from '../crypto/sign';
import { SignCommand, Sig, SignedSig, UnsignedSig } from './SignCommand';
import { KeyPair } from './KeyPair';
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
export function attachSig(
  msg: string,
  kpArray: Array<KeyPair>,
): Array<SignedSig> | Array<UnsignedSig> {
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
/**
 * Make an ED25519 "signer" array element for inclusion in a Pact payload.
 * @param {object} kp - a ED25519 keypair and/or clist (list of `cap` in mkCap)
 * @return {object} an object with pubKey, addr and scheme fields.
 */
export function mkSigner(kp: KeyPair) {
  if (kp.clist) {
    return {
      clist: kp.clist,
      pubKey: kp.publicKey,
    };
  } else {
    return { pubKey: kp.publicKey };
  }
}
