import { harden } from '../utils';
import { kadenaGenKeypair as kadenaGenKeypairOriginal } from './vendor/kadena-crypto';

const HARDENED_OFFSET = 0x80000000;

export function kadenaGenOneKeypair(
  password: string,
  rootKey: string | Uint8Array,
  index: number,
): [Uint8Array, Uint8Array] {
  if (index < HARDENED_OFFSET) {
    throw new Error('Index must be hardened');
  }
  return kadenaGenKeypairOriginal(password, rootKey, index);
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
): [Uint8Array, Uint8Array];

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
): [Uint8Array, Uint8Array][];

export function kadenaGenKeypair(
  password: string,
  rootKey: string | Uint8Array,
  indexOrRange: number | [start: number, end: number],
) {
  if (typeof indexOrRange === 'number') {
    return kadenaGenOneKeypair(password, rootKey, harden(indexOrRange));
  }
  const [start, end] = indexOrRange;
  const keypairs = [];
  for (let i = start; i <= end; i += 1) {
    keypairs.push(kadenaGenOneKeypair(password, rootKey, harden(i)));
  }
  return keypairs;
}
