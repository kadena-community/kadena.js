import { EncryptedString, kadenaDecrypt } from '../../index.js';
import { kadenaGenKeypair } from '../kadena-crypto.js';

export async function kadenaGetPublicFromRootKey(
  password: string,
  rootKey: EncryptedString,
  index: number,
): Promise<Uint8Array> {
  const decrypted = kadenaDecrypt(password, rootKey);
  const [, publicKey] = await kadenaGenKeypair(password, decrypted, index);
  return publicKey;
}
