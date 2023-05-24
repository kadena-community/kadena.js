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

export const generateApiHost = (networkId: string, chainId: string): string => {
  return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};
