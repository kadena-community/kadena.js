import base64UrlDecode from './base64UrlDecode';
import strToUint8Array from './strToUint8Array';

/**
 * Takes in Uint8Array binary object and outputs hex string.
 */
export default function base64UrlDecodeArr(input: string): Uint8Array {
  return strToUint8Array(base64UrlDecode(input));
}
