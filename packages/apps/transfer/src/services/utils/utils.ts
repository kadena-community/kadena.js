import { ChainId } from '@kadena/types';

export const generateApiHost = (
  server: string,
  networkId: string,
  chainId: string,
): string => {
  return `https://${server}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

export const convertIntToChainId = (value: number): ChainId => {
  return value.toString() as ChainId;
};

export const validateRequestKey = (key: string): boolean => {
  return key.length === 43;
};
