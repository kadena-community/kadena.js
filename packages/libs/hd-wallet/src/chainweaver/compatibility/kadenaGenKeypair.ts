import { HARDENED_OFFSET, harden } from '../../utils/crypto.js';
import { kadenaGenKeypair as kadenaGenKeypairOriginal } from '../kadena-crypto.js';

async function kadenaGenOneKeypair(
  password: string,
  rootKey: string | Uint8Array,
  index: number,
): Promise<[Uint8Array, Uint8Array]> {
  if (index < HARDENED_OFFSET) {
    throw new Error('Index must be hardened');
  }
  return await kadenaGenKeypairOriginal(password, rootKey, index);
}

/**
 *
 * @param password
 * @param rootKey
 * @param index start from 0; it will be hardened automatically
 */
export function kadenaGenKeypair(
  password: string,
  rootKey: string | Uint8Array,
  index: number,
): Promise<[Uint8Array, Uint8Array]>;

/**
 *
 * @param password
 * @param rootKey
 * @param range [start, end] start from 0; it will be hardened automatically
 */
export function kadenaGenKeypair(
  password: string,
  rootKey: string | Uint8Array,
  range: [start: number, end: number],
): Promise<[Uint8Array, Uint8Array][]>;

export async function kadenaGenKeypair(
  password: string,
  rootKey: string | Uint8Array,
  indexOrRange: number | [start: number, end: number],
) {
  if (typeof indexOrRange === 'number') {
    return await kadenaGenOneKeypair(password, rootKey, harden(indexOrRange));
  }
  const [start, end] = indexOrRange;
  const keypairs = [];
  for (let i = start; i <= end; i += 1) {
    keypairs.push(await kadenaGenOneKeypair(password, rootKey, harden(i)));
  }
  return keypairs;
}
