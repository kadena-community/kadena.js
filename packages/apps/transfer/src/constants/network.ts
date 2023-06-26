import { kadenaConstants } from './kadena';

export const chainNetwork: {
  Mainnet: { server: string; network: string };
  Testnet: { server: string; network: string };
} = {
  Mainnet: {
    server: kadenaConstants.MAINNET.API,
    network: kadenaConstants.MAINNET.NETWORKS.MAINNET01,
  },
  Testnet: {
    server: kadenaConstants.TESTNET.API,
    network: kadenaConstants.TESTNET.NETWORKS.TESTNET04,
  },
};
