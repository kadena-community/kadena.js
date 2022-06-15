import hashBin from '../crypto/hashBin';
import base64UrlEncodeArr from '../crypto/base64UrlEncodeArr';
import sign from '../crypto/sign';
import { KeyPair } from './KeyPair';

export function asArray(singleOrArray: any): Array<string> {
  if (Array.isArray(singleOrArray)) {
    return singleOrArray;
  } else {
    return [singleOrArray];
  }
}
