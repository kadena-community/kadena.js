import type { ChainId } from '@kadena/types';
import dotenv from 'dotenv';
import { balanceCheck } from './alerts/elastic/balanceCheck';
import { balanceAlert } from './alerts/slack/balanceAlert';
import { balanceChangeAlert } from './alerts/slack/balanceChangeAlert';
import { graphAlert } from './alerts/slack/graphAlert';
import { kinesisBalanceChangeAlert } from './alerts/slack/kinesisBalanceChangeAlert';

dotenv.config();
export const channelId = process.env.SLACK_CHANNELID ?? '';
export const tokenId = process.env.SLACK_TOKEN;
export const faucetAccount = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';
export const xchainGasStationAccount = 'kadena-xchain-gas';
export const GalxeAccount = process.env.NEXT_PUBLIC_GALXE || '';
export const MINBALANCE = 1000;
export const MINXCHAINGASSTATIONBALANCE = 0.9;
export const MINXGALXEBALANCE = 1000;
export const MINXGALXEBALANCE_CHAIN2 = 150;

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
  LOWXGALXEBALANCE_CHAIN2: 'LOWXGALXEBALANCE_CHAIN2',
  GRAPHDOWN: 'GRAPHDOWN',
  KINESISBRIDGEBALANCECHANGE: 'KINESISBRIDGEBALANCECHANGE',
  BALANCECHANGE: 'BALANCECHANGE',
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
    label: 'MAINNET',
    url: 'https://graph.kadena.network/graphql',
    key: 'mainnet01',
  },
  {
    label: 'TESTNET',
    url: 'https://graph.testnet.kadena.network/graphql',
    key: 'testnet04',
  },
];

// export const NETWORKS: INETWORK[] = [
//   {
//     label: 'Hackachain MAINNET',
//     url: 'https://api.mainnet.kadindexer.io/v0',
//     key: 'mainnet01',
//   },
//   {
//     label: 'Hackachain TESTNET',
//     url: 'https://api.testnet.kadindexer.io/v0',
//     key: 'testnet04',
//   },
// ];

// check at what interval this slack alert can be called
export type IIntervalGroup = '12hours' | '1hour' | '15minutes';
export const INTERVALGROUPS: Record<IIntervalGroup, IIntervalGroup> = {
  '12hours': '12hours',
  '15minutes': '15minutes',
  '1hour': '1hour',
};
export const isIntervalGroup = (val: string): val is IIntervalGroup => {
  return Object.keys(INTERVALGROUPS).includes(val as IIntervalGroup);
};

export const slackAlerts = {
  BALANCEALERT: balanceAlert,
  BALANCECHANGEALERT: balanceChangeAlert,
  KINESISBALANCECHANGEALERT: kinesisBalanceChangeAlert,
  GRAPHALERT: graphAlert,
} satisfies Record<string, (alert: IAlert) => Promise<string[]>>;

export const elasticAlerts = {
  BALANCEALERT: balanceCheck,
  BALANCECHANGEALERT: balanceCheck,
} satisfies Record<string, (alert: IAlert) => Promise<string[]>>;

export const MESSAGETYPES = {
  slack: slackAlerts,
  elastic: elasticAlerts,
};

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
  chainIds: readonly ChainId[]; // which chains to check
  slackChannelIds: string[]; // which slack channels to send the message to
  messageType: {
    slack?: (alert: IAlert) => Promise<string[]>;
    elastic?: (alert: IAlert) => Promise<string[]>;
  };
  intervalGroup: IIntervalGroup; // sets the interval of the cronjob
}

export const getMainNet = (): INETWORK => {
  return NETWORKS.find((n) => n.key === 'mainnet01') ?? NETWORKS[0];
};

export const getTestNet = (): INETWORK => {
  return NETWORKS.find((network) => network.key === 'testnet04') ?? NETWORKS[1];
};
