import { kadenaSign } from '../vendor/kadena-crypto';
import { kadenaGenKeypair } from './kadenaGenKeypair';

/**
 * Sign a message with a root key and the index of the keypair to use
 * @param password
 * @param message
 * @param rootKey
 * @param index
 * @returns signature
 */
export function kadenaSignFromRootKey(
  password: string,
  message: string,
  rootKey: string | Uint8Array,
  index: number,
): Uint8Array {
  const [privateKey] = kadenaGenKeypair(password, rootKey, index);
  return kadenaSign(password, message, privateKey);
}
