
export function bigintSortFn(a: bigint, b: bigint): number {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}
