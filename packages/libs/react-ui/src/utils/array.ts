export function getArrayOf<T>(mapper: (i: number) => T, length: number): T[] {
  return Array.from({ length }, (s, i) => mapper(i));
}
