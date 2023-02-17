import { blake2b } from 'blakejs';

/**
 * Takes in string and outputs blake2b256 hash binary as a Uint8Array.
 *
 * @alpha
 */
export function hashBin(str: string): Uint8Array {
  return blake2b(str, undefined, 32);
}
