import type { IBase64Url } from '@kadena/types';
import { base64UrlDecode } from './base64UrlDecode';
import { strToUint8Array } from './strToUint8Array';

/**
 * Takes in a hex string and outputs a Uint8Array binary object.
 *
 * @alpha
 */
export function base64UrlDecodeArr(input: IBase64Url): Uint8Array {
  return strToUint8Array(base64UrlDecode(input));
}
