export function mergeOptions<T extends Record<string, unknown> | undefined>(
  first: T,
  second: T,
): T {
  if (!first) return second;
  if (!second) return first;
  const merged: T = { ...second };
  Object.entries(first).forEach(([key, value]) => {
    if (merged[key] === undefined) {
      merged[key] = value;
      return;
    }
    if (Array.isArray(merged[key])) {
      merged[key] = [
        ...(Array.isArray(value) ? value : [value]),
        ...(merged[key] as Array<unknown>),
      ];
      return;
    }
    if (
      value !== null &&
      typeof merged[key] === 'object' &&
      typeof value === 'object'
    ) {
      merged[key] = mergeOptions(
        value as Record<string, unknown>,
        merged[key] as Record<string, unknown>,
      );
      return;
    }
  });
  return merged;
}
