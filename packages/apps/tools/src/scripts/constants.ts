import dotenv from 'dotenv';
dotenv.config();
export const channelId = process.env.SLACK_CHANNELID ?? '';
export const tokenId = process.env.SLACK_TOKEN;
export const faucetAccount = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';
export const xchainGasStationAccount = 'kadena-xchain-gas';
export const GalxeAccount = process.env.NEXT_PUBLIC_GALXE || '';
export const MINBALANCE = 1000;
export const MINXCHAINGASSTATIONBALANCE = 0.9;
export const MINXGALXEBALANCE = 5;

//graph
export const MAXBLOCKHEIGHT_DIFFERENCE = 100;

export interface IChainAccount {
  balance: number;
  chainId: string;
}

export interface IAccount {
  data?: {
    fungibleAccount: {
      chainAccounts: IChainAccount[];
    };
  };
  errors?: { message: string }[];
}

export interface INETWORK {
  label: string;
  url: string;
  key: 'MAINNET' | 'TESTNET';
}

export const NETWORKS: INETWORK[] = [
  {
    label: 'Hackachain MAINNET',
    url: 'https://api.mainnet.kadindexer.io/v0',
    key: 'MAINNET',
  },
  {
    label: 'Hackachain TESTNET',
    url: 'https://api.testnet.kadindexer.io/v0',
    key: 'TESTNET',
  },
];
