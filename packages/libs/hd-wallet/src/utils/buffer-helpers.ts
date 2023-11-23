/**
 * Convert a Buffer to a Base64 encoded string.
 * @param {Buffer} buffer - Buffer to convert.
 * @returns {string} - Returns the Base64 encoded string.
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

/**
 * Convert a Base64 encoded string to a Buffer.
 * @param {string} base64 - Base64 encoded string to convert.
 * @returns {Buffer} - Returns the resulting Buffer.
 */
export function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}

/**
 * Convert a Uint8Array to a hexadecimal string.
 * @param {Uint8Array} uint8Array - The array to convert.
 * @returns {string} - Returns the hexadecimal representation of the input.
 */
export const uint8ArrayToHex = (uint8Array: Uint8Array): string => {
  if (uint8Array.length === 33 && uint8Array.at(0) === 0) {
    uint8Array = uint8Array.slice(1);
  }
  return [...uint8Array].map((x) => x.toString(16).padStart(2, '0')).join('');
};
