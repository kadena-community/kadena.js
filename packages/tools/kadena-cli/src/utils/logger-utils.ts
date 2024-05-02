export const maskSensitiveInfo = (
  obj: unknown,
  fieldsToMask: string[] = ['password', 'passwordFile', 'newPasswordFile'],
  mask: string = '******',
): unknown => {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveInfo(item, fieldsToMask));
  }

  return Object.entries(obj as Record<string, unknown>).reduce(
    (acc, [key, value]) => {
      acc[key] = fieldsToMask.includes(key)
        ? mask
        : typeof value === 'object' && value !== null
          ? maskSensitiveInfo(value, fieldsToMask)
          : value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
};
