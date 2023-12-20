import type { ICap, ISigner } from '@kadena/types';

export interface ISignerKeyPair {
  publicKey: string;
  secretKey?: string;
  clist?: ICap[];
}

/**
 * Make an ED25519 "signer" array element for inclusion in a Pact payload.
 * @param {object} keyPair - a ED25519 keypair and/or clist (list of `cap` in mkCap)
 * @return {object} an object with pubKey, addr and scheme fields.
 */
export function pullSigner({ clist, publicKey }: ISignerKeyPair): ISigner {
  if (clist) {
    return { clist, pubKey: publicKey };
  } else {
    return { pubKey: publicKey };
  }
}
