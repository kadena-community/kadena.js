/**
 * Takes in string and outputs Uint8Array
 */
export default function strToUint8Array(str: string): Uint8Array {
  let arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}
