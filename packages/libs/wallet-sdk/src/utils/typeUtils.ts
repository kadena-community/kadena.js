// eslint-disable-next-line @rushstack/no-new-null
export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
