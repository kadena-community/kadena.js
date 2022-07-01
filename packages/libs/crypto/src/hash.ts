import { base64UrlEncodeArr } from './base64UrlEncodeArr';
import { hashBin } from './hashBin';
/**
 * Takes in string, outputs blake2b256 hash encoded as unescaped base64url.
 */
export function hash(str: string): string {
  return base64UrlEncodeArr(hashBin(str));
}
