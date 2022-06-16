import { KeyPair } from '../util';
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
