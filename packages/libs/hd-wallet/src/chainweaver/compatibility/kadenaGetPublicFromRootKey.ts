import { kadenaGenKeypair } from '../kadena-crypto.js';

export async function kadenaGetPublicFromRootKey(
  password: string,
  rootKey: string | Uint8Array,
  index: number,
): Promise<Uint8Array> {
  const [, publicKey] = await kadenaGenKeypair(password, rootKey, index);
  return publicKey;
}
