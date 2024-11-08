export const transformPactDate = (val: any): Date | null => {
  if (!val) return null;

  const hasOwnProperty = Object.prototype.hasOwnProperty;

  if (hasOwnProperty.call(val, 'timep') && typeof val.timep === 'number') {
    return new Date(val.timep);
  }

  if (hasOwnProperty.call(val, 'time') && typeof val.time === 'number') {
    return new Date(val.time);
  }

  return null;
};

export const isNameExpired = (expiryDateMs: number): boolean => {
  const gracePeriod = 31 * 24 * 60 * 60 * 1000;
  return Date.now() > expiryDateMs + gracePeriod;
};
