import { blake2b } from 'blakejs';

/**
 * Takes in string and outputs blake2b256 hash
 */
export function hashBin(str: string): Uint8Array {
  return blake2b(str, undefined, 32);
}
