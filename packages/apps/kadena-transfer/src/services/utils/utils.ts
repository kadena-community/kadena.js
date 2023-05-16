const convertDecimal = (decimal: number): number => {
  if (decimal.toString().includes('.')) {
    return decimal;
  }
  if (decimal / Math.floor(decimal) === 1) {
    decimal = Number(`${decimal.toString}.0`);
  }
  return decimal;
};

function onlyKey(account: string): string {
  return account.split(':')[1];
}
