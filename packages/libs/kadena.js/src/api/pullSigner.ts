import type { IKeyPair, ISigner } from '@kadena/types';
/**
 * Make an ED25519 "signer" array element for inclusion in a Pact payload.
 * @param {object} keyPair - a ED25519 keypair and/or clist (list of `cap` in mkCap)
 * @return {object} an object with pubKey, addr and scheme fields.
 */
export function pullSigner({ clist, publicKey }: IKeyPair): ISigner {
  if (clist) {
    return { clist, pubKey: publicKey };
  } else {
    return { pubKey: publicKey };
  }
}
