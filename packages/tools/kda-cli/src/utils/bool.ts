export const isTruthy = (
  value?: boolean | object | number | string | string[],
): boolean => {
  if (typeof value === 'boolean') return value;
  if (value === undefined) return false;
  if (value === null) return false;
  if (value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const isFalsy = (
  value?: boolean | object | number | string | string[],
): boolean => {
  return !isTruthy(value);
};
