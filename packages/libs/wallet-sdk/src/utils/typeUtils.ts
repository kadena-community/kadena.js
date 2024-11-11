export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isEmpty<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}
