export const valueToString = (value: string | string[]): string => {
  if (typeof value === 'object') {
    return value.reduce((acc, val) => {
      if (!val) return acc;
      return `${acc}${val} `;
    }, '');
  }

  return value;
};
