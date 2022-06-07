export function asArray(singleOrArray: any): Array<string> {
  if (Array.isArray(singleOrArray)) {
    return singleOrArray;
  } else {
    return [singleOrArray];
  }
}
