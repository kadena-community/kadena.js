import type { Base64Url } from '../util/Base64Url';

import base64UrlDecode from './base64UrlDecode';
import strToUint8Array from './strToUint8Array';

/**
 * Takes in a hex string and outputs a Uint8Array binary object.
 */
export default function base64UrlDecodeArr(input: Base64Url): Uint8Array {
  return strToUint8Array(base64UrlDecode(input));
}
