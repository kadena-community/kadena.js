export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isUndefinedOrNull<T>(
  // eslint-disable-next-line @rushstack/no-new-null
  value: T | undefined | null,
  // eslint-disable-next-line @rushstack/no-new-null
): value is null | undefined {
  // eslint-disable-next-line @rushstack/no-new-null
  return value === null || value === undefined;
}
