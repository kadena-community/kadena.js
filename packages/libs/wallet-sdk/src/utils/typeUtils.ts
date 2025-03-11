export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isEmpty<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}

/** contents of array are equal. Must be UNIQUE values */
export function arrayEquals(a: string[], b: string[]): boolean {
  const aSet = new Set(a);
  const bSet = new Set(b);
  if (aSet.size !== bSet.size) return false;
  for (const item of aSet) {
    if (!bSet.has(item)) return false;
  }
  return true;
}
