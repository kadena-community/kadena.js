import { env } from '@/utils/env';
import type { ChainId } from '@kadena/client';

export const getChainId = (): ChainId => {
  return env.CHAINID as ChainId;
};

export const getNetworkId = (): string => {
  return env.NETWORKID;
};

export const getNetworkName = (): string => {
  return env.NETWORKNAME;
};

export const getApiHost = (): string => {
  switch (getNetworkName()) {
    case 'mainnet':
      return `https://api.chainweb.com/chainweb/0.0/${getNetworkId()}/chain/${getChainId()}/pact`;
    case 'testnet':
      return `https://api.${getNetworkName()}.chainweb.com/chainweb/0.0/${getNetworkId()}/chain/${getChainId()}/pact`;
    default:
      return `${
        env.CHAINWEB_URL
      }/chainweb/0.0/${getNetworkId()}/chain/${getChainId()}/pact`;
  }
};
