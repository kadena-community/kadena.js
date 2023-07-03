import { kadenaConstants, Network } from './kadena';

export const chainNetwork: {
  [K in Network]: { server: string; network: string };
} = {
  MAINNET: {
    server: kadenaConstants.MAINNET.API,
    network: kadenaConstants.MAINNET.NETWORKS.MAINNET01,
  },
  TESTNET: {
    server: kadenaConstants.TESTNET.API,
    network: kadenaConstants.TESTNET.NETWORKS.TESTNET04,
  },
};
