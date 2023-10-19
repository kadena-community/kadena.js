export const safeJsonParse = <T>(str?: string | null): T | null => {
  try {
    if (!str) return null;
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};
