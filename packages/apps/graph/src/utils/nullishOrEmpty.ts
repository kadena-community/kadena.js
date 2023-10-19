export function nullishOrEmpty(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return value === null || value === undefined || value === '';
}
