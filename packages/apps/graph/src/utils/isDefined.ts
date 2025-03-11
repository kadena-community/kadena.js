/**
 * Wrapper for filter(Boolean) that also narrows the type.
 * @example `[].filter(isDefined)` is equal to `[].filter(Boolean)`.
 * @param value - The value to check.
 * @returns `true` if the value is defined, `false` otherwise.
 */
export function isDefined<T>(
  value: T | null | undefined,
): value is NonNullable<T> {
  return Boolean(value);
}
