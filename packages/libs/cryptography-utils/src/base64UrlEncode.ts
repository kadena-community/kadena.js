import type { IBase64Url } from '@kadena/types';
import { InvalidCharacterError } from './InvalidCharacterError';

const chars: string =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';

/**
 * Takes in string and outputs Base64 Url encoded string
 * code from [https://gist.github.com/999166] by [https://github.com/nignag]
 *
 * @alpha
 */
export function base64UrlEncode(str: string): IBase64Url {
  let block: number | undefined;
  let charCode: number;
  let output: string = '';
  for (
    let idx = 0, map = chars;
    // eslint-disable-next-line no-bitwise
    str.charAt(idx | 0);
    // eslint-disable-next-line no-bitwise
    output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))
  ) {
    charCode = str.charCodeAt((idx += 3 / 4));
    if (charCode > 0xff) {
      throw new InvalidCharacterError(
        "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
      );
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, no-bitwise
    block = ((block || 0) << 8) | charCode;
  }
  return output;
}
