export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isUndefinedOrNull<T>(value: T | undefined | null): value is null | undefined {
  return value === null || value === undefined;
}
