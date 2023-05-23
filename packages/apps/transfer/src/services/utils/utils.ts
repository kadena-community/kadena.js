export const convertDecimal = (decimal: number): number => {
  if (decimal.toString().includes('.')) {
    return decimal;
  }
  if (decimal / Math.floor(decimal) === 1) {
    decimal = Number(`${decimal.toString}.0`);
  }
  return decimal;
};

export const onlyKey = (account: string): string => {
  return account.split(':')[1];
};
