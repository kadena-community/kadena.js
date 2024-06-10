export const ifNill = <T>(
  value: string | null | undefined,
  fallback: T,
): T | Exclude<typeof value, null | undefined> => {
  return value ?? fallback;
};
