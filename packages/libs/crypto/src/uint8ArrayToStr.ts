/**
 * Convert Uint8Array to string
 *
 * @alpha
 */
export function uint8ArrayToStr(array: Uint8Array): string {
  return String.fromCharCode.apply(null, [...new Uint16Array(array)]);
}
