import { Base64Url } from './Base64Url';
import { Command } from './PactCommand';

type hashes = {
  [key: string]: boolean;
};

export function unique(hashes: Array<Base64Url>): Array<Base64Url> {
  let isUnique: hashes = {};
  let uniqueHashes = [];
  for (let i = 0; i < hashes.length; i++) {
    if (!isUnique[hashes[i]]) {
      isUnique[hashes[i]] = true;
      uniqueHashes.push(hashes[i]);
    }
  }
  return uniqueHashes;
}
