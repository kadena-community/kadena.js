import { Buffer } from 'buffer';

/**
 * Takes in hex string and outputs Uint8Array binary object.
 *
 * @alpha
 */
export function hexToBin(hexString: string): Uint8Array {
  const uint8Array = new Uint8Array(Buffer.from(hexString, 'hex'));

  return uint8Array;
}
