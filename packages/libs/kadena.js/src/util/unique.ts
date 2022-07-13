import type { IBase64Url } from '@kadena/types';

interface IHashes {
  [key: string]: boolean;
}

export function unique(hashes: Array<IBase64Url>): Array<IBase64Url> {
  const isUnique: IHashes = {};
  return hashes.filter((hash) => {
    if (!isUnique[hash]) {
      isUnique[hash] = true;
      return true;
    }
    return false;
  });
}
