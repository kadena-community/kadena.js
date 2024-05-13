import type { EncryptedString } from '../../index.js';
import { kadenaDecrypt } from '../../index.js';
import { kadenaSign } from '../vendor/kadena-crypto.cjs';
import { kadenaGenKeypair } from './kadenaGenKeypair.js';

/**
 * Sign a base64 message with a root key and the index of the keypair to use
 * @param password
 * @param hash // base64 hash
 * @param rootKey
 * @param index
 * @returns signature
 */
export async function kadenaSignFromRootKey(
  password: string | Uint8Array,
  hash: string,
  rootKey: EncryptedString,
  index: number,
): Promise<Uint8Array> {
  const { secretKey } = await kadenaGenKeypair(password, rootKey, index);
  const secret = await kadenaDecrypt(password, secretKey);
  return kadenaSign(password, Buffer.from(hash, 'base64'), secret);
}
