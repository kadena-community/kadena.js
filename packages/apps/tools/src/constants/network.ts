import { kadenaConstants, Network } from './kadena';

export const chainNetwork: {
  [K in Network]: { server: string; network: Network };
} = {
  mainnet01: {
    server: kadenaConstants.mainnet01.API,
    network: 'mainnet01',
  },
  testnet04: {
    server: kadenaConstants.testnet04.API,
    network: 'testnet04',
  },
};
