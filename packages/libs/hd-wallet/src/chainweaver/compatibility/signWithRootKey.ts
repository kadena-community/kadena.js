import { kadenaSign } from '../vendor/kadena-crypto';
import { kadenaGenKeypair } from './kadenaGenKeypair';

/**
 * Sign a message with a root key
 * @param password
 * @param rootKey
 * @param index
 * @param message
 * @returns signature
 */
export function signWithRootKey(
  password: string,
  rootKey: string | Uint8Array,
  index: number,
  message: string,
): Uint8Array {
  const [privateKey] = kadenaGenKeypair(password, rootKey, index);
  return kadenaSign(password, message, privateKey);
}
