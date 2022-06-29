import { Base64Url } from './Base64Url';
import { Command } from './PactCommand';

type hashes = {
  [key: string]: boolean;
};

export function unique(hashes: Array<Base64Url>): Array<Base64Url> {
  let isUnique: hashes = {};
  return hashes.filter((hash) => {
    if (!isUnique[hash]) {
      isUnique[hash] = true;
      return true;
    }
    return false;
  });
}
