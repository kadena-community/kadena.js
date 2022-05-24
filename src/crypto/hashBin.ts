import blake from 'blakejs';

/**
 * Takes in string and outputs blake2b256 hash
 */
export default function hashBin(str: string): Uint8Array {
  return blake.blake2b(str, undefined, 32);
}
