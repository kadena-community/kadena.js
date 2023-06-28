import { ChainId } from '@kadena/types';

export const convertIntToChainId = (value: number): ChainId => {
  return value.toString() as ChainId;
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
