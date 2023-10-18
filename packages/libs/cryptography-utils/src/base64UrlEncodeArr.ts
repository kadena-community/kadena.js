import type { IBase64Url } from '@kadena/types';
import { base64UrlEncode } from './base64UrlEncode';
import { uint8ArrayToStr } from './uint8ArrayToStr';

/**
 * Takes in Uint8Array binary object and outputs hex string.
 *
 * @alpha
 */
export function base64UrlEncodeArr(input: Uint8Array): IBase64Url {
  return base64UrlEncode(uint8ArrayToStr(input));
}
