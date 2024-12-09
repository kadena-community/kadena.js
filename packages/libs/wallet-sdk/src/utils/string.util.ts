export const safeJsonParse = <T>(
  value: string | null | undefined,
): T | null => {
  try {
    if (typeof value !== 'string') return null;
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};
