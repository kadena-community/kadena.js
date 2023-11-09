import { kadenaGenKeypair } from './kadenaGenKeypair';

export function getPublicKeyFormRootKey(
  password: string,
  rootKey: string | Uint8Array,
  index: number,
): Uint8Array {
  const [, publicKey] = kadenaGenKeypair(password, rootKey, index);
  return publicKey;
}
