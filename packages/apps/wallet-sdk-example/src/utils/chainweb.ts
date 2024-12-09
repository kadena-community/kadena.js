export const parseBalance = (
  balance:
    | number
    | {
        decimal: number;
      }
    | undefined,
) => {
  if (typeof balance === 'number') {
    return balance.toString();
  }
  if (balance?.decimal) {
    return balance.decimal.toString();
  }
  return '0';
};
