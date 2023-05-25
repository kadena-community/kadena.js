import { ChainId } from '@kadena/types';

export const onlyKey = (account: string): string => {
  return account.split(':')[1];
};

export const generateApiHost = (networkId: string, chainId: string): string => {
  return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

export const convertDecimal = (decimal: string): string => {
  if (decimal.includes('.')) {
    return decimal;
  }
  return Number(decimal).toFixed(1);
};

export const convertIntToChainId = (value: number): ChainId => {
  return value.toString() as ChainId;
};
