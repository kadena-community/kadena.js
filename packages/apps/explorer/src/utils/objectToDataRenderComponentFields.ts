export const objectToDataRenderComponentFields = (
  obj: Record<string, unknown>,
): { key: string; value: string }[] => {
  return Object.entries(obj).map(([key, value]) => ({
    key,
    value: JSON.stringify(value),
  }));
};
