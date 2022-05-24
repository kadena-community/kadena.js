import base64UrlEncode from './base64UrlEncode';
import uint8ArrayToStr from './uint8ArrayToStr';

/**
 * Takes in Uint8Array binary object and outputs hex string.
 */

export default function base64UrlEncodeArr(input: Uint8Array): string {
  return base64UrlEncode(uint8ArrayToStr(input));
}
