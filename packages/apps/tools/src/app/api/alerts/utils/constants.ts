import type { ChainId } from '@kadena/types';
import { balanceAlert } from './balanceAlert';

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
} as const;

export const MESSAGETYPES = {
  BALANCEALERT: balanceAlert,
} as const;

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

export interface IAlert {
  title: string;
  code: keyof typeof ALERTCODES;
  networks: INETWORK[];
  options?: {
    account: string;
    minBalance: number;
    gif?: string;
  };
  chainIds: readonly ChainId[];
  slackChannelIds: string[];
  messageType: (alert: IAlert) => Promise<string[]>;
}
