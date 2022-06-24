import { KeyPair, Signer } from '../util';
/**
 * Make an ED25519 "signer" array element for inclusion in a Pact payload.
 * @param {object} keyPair - a ED25519 keypair and/or clist (list of `cap` in mkCap)
 * @return {object} an object with pubKey, addr and scheme fields.
 */
export default function pullSigner(keyPair: KeyPair): Signer {
  if (keyPair.clist) {
    return {
      clist: keyPair.clist,
      pubKey: keyPair.publicKey,
    };
  } else {
    return { pubKey: keyPair.publicKey };
  }
}
