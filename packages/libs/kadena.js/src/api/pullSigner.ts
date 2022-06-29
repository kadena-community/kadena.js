import { KeyPair, Signer } from '../util';
/**
 * Make an ED25519 "signer" array element for inclusion in a Pact payload.
 * @param {object} keyPair - a ED25519 keypair and/or clist (list of `cap` in mkCap)
 * @return {object} an object with pubKey, addr and scheme fields.
 */
export default function pullSigner({ clist, publicKey }: KeyPair): Signer {
  if (clist) {
    return { clist, pubKey: publicKey };
  } else {
    return { pubKey: publicKey };
  }
}
