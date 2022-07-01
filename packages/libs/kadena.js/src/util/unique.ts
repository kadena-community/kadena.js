import type { Base64Url } from '@kadena/types';

interface IHashes {
  [key: string]: boolean;
}

export function unique(hashes: Array<Base64Url>): Array<Base64Url> {
  const isUnique: IHashes = {};
  return hashes.filter((hash) => {
    if (!isUnique[hash]) {
      isUnique[hash] = true;
      return true;
    }
    return false;
  });
}
