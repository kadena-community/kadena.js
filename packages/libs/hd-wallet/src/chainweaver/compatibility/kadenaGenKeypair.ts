import type { EncryptedString } from '../../index.js';
import { kadenaDecrypt } from '../../index.js';
import { kadenaGenKeypair as kadenaGenKeypairOriginal } from '../kadena-crypto.js';
import { encryptLegacySecretKey } from './encryption.js';

const HARDENED_OFFSET = 0x80000000;
const harden = (n: number) => HARDENED_OFFSET + n;

async function kadenaGenOneKeypair(
  password: string | Uint8Array,
  rootKey: Uint8Array,
  index: number,
): Promise<{ publicKey: string; secretKey: EncryptedString }> {
  if (index < HARDENED_OFFSET) {
    throw new Error('Index must be hardened');
  }
  const keyPair = await kadenaGenKeypairOriginal(password, rootKey, index);
  return {
    publicKey: Buffer.from(keyPair[1]).toString('hex'),
    secretKey: await encryptLegacySecretKey(password, keyPair[0]),
  };
}

/**
 *
 * @param password
 * @param rootKey
 * @param index start from 0; it will be hardened automatically
 */
export function kadenaGenKeypair(
  password: string | Uint8Array,
  rootKey: EncryptedString,
  index: number,
): Promise<{ publicKey: string; secretKey: EncryptedString }>;

/**
 *
 * @param password
 * @param rootKey
 * @param range [start, end] start from 0; it will be hardened automatically
 */
export function kadenaGenKeypair(
  password: string | Uint8Array,
  rootKey: EncryptedString,
  range: [start: number, end: number],
): Promise<{ publicKey: string; secretKey: EncryptedString }[]>;

export async function kadenaGenKeypair(
  password: string | Uint8Array,
  rootKey: EncryptedString,
  indexOrRange: number | [start: number, end: number],
) {
  const decrypted = await kadenaDecrypt(password, rootKey);
  if (typeof indexOrRange === 'number') {
    return await kadenaGenOneKeypair(password, decrypted, harden(indexOrRange));
  }
  const [start, end] = indexOrRange;
  const keypairs = [];
  for (let i = start; i <= end; i += 1) {
    keypairs.push(await kadenaGenOneKeypair(password, decrypted, harden(i)));
  }
  return keypairs;
}
