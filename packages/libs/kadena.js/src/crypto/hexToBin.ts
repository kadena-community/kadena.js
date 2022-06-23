/**
 * Takes in hex string and outputs Uint8Array binary object.
 */
export default function hexToBin(hexString: string): Uint8Array {
  return new Uint8Array(Buffer.from(hexString, 'hex'));
}
