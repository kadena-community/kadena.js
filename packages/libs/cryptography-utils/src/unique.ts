import type { IBase64Url } from '@kadena/types';

interface IHashes {
  [key: string]: boolean;
}

/**
 * Takes in Array with IBase64Url values and outputs an Array with unique IBase64Url values
 * @example
 * Here's some example code to use unique:
 *
 * ```ts
 *   const cmdHashes = [
 *     'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
 *     'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
 *     'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
 *   ];
 *
 *   const uniqueHashesArray = unique(cmdHashes);
 *
 *   // output [
 *   //  'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
 *   //  'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
 *   // ];
 *
 * ```
 * @alpha
 */
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
