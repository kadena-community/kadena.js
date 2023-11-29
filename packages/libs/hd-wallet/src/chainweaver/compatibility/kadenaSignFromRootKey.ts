import { kadenaSign } from '../vendor/kadena-crypto.cjs';
import { kadenaGenKeypair } from './kadenaGenKeypair.js';

/**
 * Sign a message with a root key and the index of the keypair to use
 * @param password
 * @param message
 * @param rootKey
 * @param index
 * @returns signature
 */
export async function kadenaSignFromRootKey(
  password: string,
  message: string,
  rootKey: string | Uint8Array,
  index: number,
): Promise<Uint8Array> {
  const [privateKey] = await kadenaGenKeypair(password, rootKey, index);
  return kadenaSign(password, message, privateKey);
}
