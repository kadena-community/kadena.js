import BigNumber from 'bignumber.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { decodeBase64ToNumber } from './string';
import {
  MAIN_NETWORK_API_URL,
  KADDEX_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from 'config/Constants';

export enum NetworkName {
  DEV_NETWORK = 'Devnet',
  TEST_NETWORK = 'Testnet',
  MAIN_NETWORK = 'Mainnet',
  CUSTOM_NETWORK = 'Custom',
}

export interface NodeInstance {
  name: NetworkName;
  instance: string;
  version: string;
  numberOfChains: number;
  chainIds: string[];
  chainGraphs: any[];
}

export enum TimeInterval {
  MONTH = 'month',
  TRHEE_MONTHS = 'threeMonths',
  YEAR = 'year',
  REAL_TIME = 'realTime',
}

export enum TransactionStatus {
  Success = 'TxSucceeded',
  Fail = 'TxFailed',
}

export interface TransactionDetail {
  blockHash: string;
  blockTime: string;
  chainId: number;
  preview: string;
  height: number;
  creationTime: string;
  requestKey: string;
  status: TransactionStatus;
  sender: string;
  data: any;
  result: { amount: number; token: string }[];
  events: { name: string; params: string[] }[];
  gas: number;
  gasLimit: number;
  gasPrice: number;
  logs: string;
  metadata: string | null;
  nonce: string;
  pactId: string | null;
  proof: string | null;
  rollback: string | null;
  step: number | null;
  success: boolean;
  ttl: number;
  id: number;
  continuation: string | null;
}

export interface BlockDetail {
  neighbours: { [key: string]: string };
  chainId: number;
  chainVersion: string;
  creationTime: number;
  epochStart: number;
  weight: string;
  featureFlags: number;
  hash: string;
  nonce: string;
  parent: string;
  payloadHash: string;
  target: string;
  height: number;
  powHash: string;
  txCount: number;
}

export interface NodeHash {
  hash: string;
  height: number;
}

export interface DefaultQueryParams {
  network: NetworkName;
}

export interface TimeQueryParams {
  time: TimeInterval;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export const defaultHeader = {
  Accept: '*/*',
};

export const blockJsonHeader = {
  Accept: 'application/json;blockheader-encoding=object',
};

export const jsonHeader = {
  Accept: 'application/json',
};

export function queryParamsTypeAdapter<T>(query: any): T {
  return query as any as T;
}

export function convertJSONToArray<T>(json: any): T[] {
  return Object.keys(json).map((key) => json[key]) as T[];
}

export const isCrossChainTransaction = (from: string, to: string) => {
  return from !== to;
};

export const switchBetweenConfig = async (
  network: NetworkName,
  test: () => Promise<any>,
  main: () => Promise<any>,
  defaultFunc?: () => any,
) => {
  switch (network?.toLowerCase()) {
    case NetworkName.MAIN_NETWORK.toLowerCase():
      return main();
    case NetworkName.TEST_NETWORK.toLowerCase():
    case NetworkName.DEV_NETWORK.toLowerCase():
      return test();
    default:
      if (defaultFunc) {
        return defaultFunc();
      }
      break;
  }
};

export const getNetworkConfig = (network: NetworkName) => {
  switch (network?.toLowerCase()) {
    case NetworkName.MAIN_NETWORK.toLowerCase():
      return MAIN_NETWORK_API_URL;
    case NetworkName.TEST_NETWORK.toLowerCase():
      return TEST_NETWORK_API_URL;
    case NetworkName.DEV_NETWORK.toLowerCase():
      return KADDEX_NETWORK_API_URL;
    default:
      return MAIN_NETWORK_API_URL;
  }
};

const getElementFromArrayByIndex = (array: any[], index: number) => {
  if (array.length > index) {
    return array[index];
  }
  return null;
};

export function getChainIds(
  nodeChains: string[],
  nodeGraphHistory: any[],
  height?: number | null,
): string[] {
  if (height) {
    const filteredChainGraphs: any[] = (nodeGraphHistory || []).filter(
      (item: any[]) => getElementFromArrayByIndex(item, 0) >= height,
    );
    const firstChainGraph = getElementFromArrayByIndex(filteredChainGraphs, 0);
    if (firstChainGraph) {
      const chainGraphs = getElementFromArrayByIndex(firstChainGraph, 1);
      if (chainGraphs) {
        return chainGraphs.map((chainGraph: any[]) =>
          getElementFromArrayByIndex(chainGraph, 0).toString(),
        );
      }
    }
  }
  return nodeChains || [];
}

export const getMaxHeightFromHashes = (hashes: NodeHash[]) => {
  return Math.max(0, ...(hashes || []).map((item) => item.height));
};

const MAX_INT_VALUE = new BigNumber('F'.repeat(64), 16);

export const getDifficultyFromTarget = (target: string) => {
  const bigNumber = decodeBase64ToNumber(target);
  return MAX_INT_VALUE.dividedToIntegerBy(new BigNumber(bigNumber, 16));
};

export const getTotalDifficulty = (blockHeaders: any[]) => {
  return (blockHeaders || [])
    .reduce((acc: BigNumber, blockHeader: any) => {
      if (blockHeader && (blockHeader.data || []).length > 0) {
        const latestHeightElement = blockHeader?.data[0];
        if (latestHeightElement?.target) {
          return acc.plus(getDifficultyFromTarget(latestHeightElement?.target));
        }
      }
      return acc;
    }, new BigNumber(0))
    .toString();
};

export const getEarliestTime = (blockHeaders: any[]) => {
  return Math.min(
    ...(blockHeaders || []).map((blockHeader: any) => {
      if (blockHeader && (blockHeader.data || []).length > 0) {
        const latestHeightElement = blockHeader?.data[0];
        if (latestHeightElement?.creationTime) {
          return latestHeightElement?.creationTime / 1000;
        }
      }
      return Date.now();
    }),
  );
};

export const getNetworkHashRate = (
  blockHeaders: any[],
  totalDifficulty: string,
) => {
  const earliestTime = getEarliestTime(blockHeaders);
  const nowTime = Date.now();
  if (nowTime - earliestTime < 1000) {
    return '0';
  }
  return new BigNumber(totalDifficulty)
    .dividedToIntegerBy(new BigNumber((nowTime - earliestTime) / 1000))
    .multipliedBy(new BigNumber(5))
    .toString();
};

export const wrapAPICall = (
  fn: (req: NextApiRequest, res: NextApiResponse) => void,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await fn(req, res);
    } catch (e) {
      res.status(422).end((e as Error).message);
    } finally {
      if (!res.headersSent) res.status(405).end('Method Not Allowed');
    }
  };
};
