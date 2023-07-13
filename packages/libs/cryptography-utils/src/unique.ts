interface ICache {
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
 *     'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
 *     'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
 *   ];
 *
 *   const uniqueHashesArray = unique(cmdHashes);
 *
 *   // output [
 *   //  'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
 *   //  'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
 *   // ];
 *
 * ```
 * @alpha
 */
export function unique(array: Array<string>): Array<string> {
  const isUnique: ICache = {};
  return array.filter((item: string) => {
    if (!isUnique[item]) {
      isUnique[item] = true;
      return true;
    }
    return false;
  });
}
