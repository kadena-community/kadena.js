export const onlyKey = (account: string): string => {
  return account.split(':')[1];
};

export const generateApiHost = (networkId: string, chainId: string): string => {
  const server =
    networkId === 'mainnet01' ? 'api.chainweb.com' : 'api.testnet.chainweb.com';
  return `https://${server}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

export const convertDecimal = (decimal: string): string => {
  if (decimal.includes('.')) {
    return decimal;
  }
  return Number(decimal).toFixed(1);
};

export const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 12,
});
