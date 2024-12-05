import type { ChainId } from '@kadena/client';
import type {
  createCrossChainCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';

interface ITransactionFeeTransfer extends IBaseTransfer {
  /**
   * If `true`, this transaction fee paid for multiple transfers.
   * When displaying this value in the UI, it is advised to inform
   * the user about this
   */
  isBulkTransfer: boolean;
}

interface IBaseTransfer {
  senderAccount: string;
  receiverAccount: string;
  amount: number;
  token: string;
  requestKey: string;
  success: boolean;
  chainId: ChainId;
  networkId: string;
  block: {
    hash: string;
    height: number;
    creationTime: Date;
    blockDepthEstimate: number;
  };
  /** Only available when lookup account paid for transaction fee */
  transactionFeeTransfer?: ITransactionFeeTransfer;
}

interface ISameChainTransfer extends IBaseTransfer {
  isCrossChainTransfer: false;
}

export interface ICrossChainTransfer extends IBaseTransfer {
  isCrossChainTransfer: true;
  targetChainId: ChainId;
  continuation?: {
    requestKey: string;
    success: boolean;
  };
}

export interface IEthvmDevTokenInfo {
  currentPrice?: number;
  maxSupply?: number;
  totalSupply?: number;
  circulatingSupply?: number;
  low24h?: number;
  high24h?: number;
}

export interface IChain {
  id: ChainId;
  // Will add later: type: 'pact' | 'evm'
}
export type ITransfer = ISameChainTransfer | ICrossChainTransfer;

export interface ITransferOptions {
  accountName: string;
  networkId: string;
  fungibleName?: string;
  chainId?: ChainId;
  first?: number;
  after?: string;
  before?: string;
  last?: number;
}

export interface ITransferResponse {
  transfers: ITransfer[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

export type ICreateTransfer = Parameters<typeof transferCreateCommand>[0];
export type ICreateCrossChainTransfer = Parameters<
  typeof createCrossChainCommand
>[0];
export interface IAccountDetails {
  chainId: string;
  accountDetails: IAccountDetailsResult | null;
}
export interface IAccountDetailsResult {
  guard: IGuard;
  account: string;
  balance:
    | number
    | {
        decimal: number;
      };
}

export interface IGuard {
  keys: string[];
  pred: string;
}
export interface ITransaction {
  requestKey: string;
  chainId: ChainId;
}
export type RequestKey = string;
export interface ITransactionDescriptor {
  requestKey: string;
  chainId: ChainId;
  networkId: string;
}

export interface INetworkInfo {
  nodeApiVersion: string;
  nodeBlockDelay: number;
  nodeChains: string[];
  nodeGenesisHeights: [string, number][];
  nodeGraphHistory: [number, [number, [string, string[]]][]][];
  nodeHistoricalChains: [number, [number, [string, string[]]][]][];
  nodeLatestBehaviorHeight: number;
  nodeNumberOfChains: number;
  nodePackageVersion: string;
  nodeServiceDate: string;
  nodeVersion: string;
}

export type INodeChainInfo = Pick<INetworkInfo, 'nodeChains' | 'nodeVersion'>;

export type INodeNetworkInfo = Omit<INetworkInfo, 'nodeChains'>;
