import type { ChainwebChainId } from '@kadena/chainweb-node-client';

export const convertIntToChainId = (value: number): ChainwebChainId => {
  return value.toString() as ChainwebChainId;
};

export const validateRequestKey = (key: string): string | undefined => {
  if (key.length === 43) {
    return key;
  }

  if (key.length === 44 && key[43] === '=') {
    return key.slice(0, 43);
  }

  return undefined;
};
