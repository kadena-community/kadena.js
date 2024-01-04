//removing the hDIGIT part, so we can add it programmatically (for backward compatibility)
export const getCleanedHash = (hash: string): string => {
  const regExp = /^([^.]+)h(-?\d+)$/;
  const match = hash.match(regExp);

  if (!match) return hash;
  return match[1];
};
