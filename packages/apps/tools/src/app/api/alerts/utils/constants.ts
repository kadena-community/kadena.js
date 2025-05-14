import type { ChainId } from '@kadena/types';
import dotenv from 'dotenv';
import { balanceChangeCheck } from './alerts/elastic/balanceChangeCheck';
import { balanceCheck } from './alerts/elastic/balanceCheck';
import { graphCheck } from './alerts/elastic/graphCheck';
import { balanceAlert } from './alerts/slack/balanceAlert';
import { balanceChangeAlert } from './alerts/slack/balanceChangeAlert';
import { graphAlert } from './alerts/slack/graphAlert';

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
  KINESISBRIDGEBALANCECHANGE: 'KINESISBRIDGEBALANCECHANGE',
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

// check at what interval this slack alert can be called
export type ICronType = '12hours' | '1hour' | '15minutes';
const cronTypes: ICronType[] = ['12hours', '15minutes', '1hour'];
export const isCronType = (val: string): val is ICronType => {
  return cronTypes.includes(val as ICronType);
};

export const slackAlerts = {
  BALANCEALERT: balanceAlert,
  BALANCECHANGEALERT: balanceChangeAlert,
  GRAPHALERT: graphAlert,
} satisfies Record<string, (alert: IAlert) => Promise<string[]>>;

export const elasticAlerts = {
  BALANCEALERT: balanceCheck,
  BALANCECHANGEALERT: balanceChangeCheck,
  GRAPHALERT: graphCheck,
} as typeof slackAlerts;

export const MESSAGETYPES = Object.keys(slackAlerts).reduce((acc, val) => {
  return { ...acc, [val.toUpperCase()]: [val.toUpperCase()] };
}, {}) as Record<keyof typeof slackAlerts, keyof typeof slackAlerts>;

export interface IAlert {
  title: string;
  description: string;
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
  messageType: keyof typeof MESSAGETYPES;
  cronType: ICronType;
  isElastic?: boolean;
}

export const getMainNet = (): INETWORK => {
  return NETWORKS.find((n) => n.key === 'mainnet01') ?? NETWORKS[0];
};

export const getTestNet = (): INETWORK => {
  return NETWORKS.find((network) => network.key === 'testnet04') ?? NETWORKS[1];
};
