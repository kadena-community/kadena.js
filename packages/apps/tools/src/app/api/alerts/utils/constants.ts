import type { ChainId } from '@kadena/types';
import dotenv from 'dotenv';
import { balanceAlert } from './balanceAlert';
import { graphAlert } from './graphAlert';

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

export const ALERTCODES = {
  LOWFAUCETBALANCE: 'LOWFAUCETBALANCE',
  LOWXCHAINGASBALANCE: 'LOWXCHAINGASBALANCE',
  LOWXGALXEBALANCE: 'LOWXGALXEBALANCE',
  GRAPHDOWN: 'GRAPHDOWN',
} as const;

export const MESSAGETYPES = {
  BALANCEALERT: balanceAlert,
  GRAPHDOWNALERT: graphAlert,
} as const;

export interface INETWORK {
  label: string;
  url: string;
  key: 'mainnet01' | 'testnet04';
  chainweb?: string;
  graphqlRef?: string;
}

export const NETWORKS: INETWORK[] = [
  {
    label: 'Hackachain MAINNET',
    url: 'https://api.mainnet.kadindexer.io/v0',
    key: 'mainnet01',
  },
  {
    label: 'Hackachain TESTNET',
    url: 'https://api.testnet.kadindexer.io/v0',
    key: 'testnet04',
  },
];

export interface IAlert {
  title: string;
  code: keyof typeof ALERTCODES;
  networks: INETWORK[];
  options?: {
    account?: string;
    minBalance?: number;
    gif?: string;
    maxblockHeightDiff?: number;
  };
  chainIds: readonly ChainId[];
  slackChannelIds: string[];
  messageType: (alert: IAlert) => Promise<string[]>;
}
