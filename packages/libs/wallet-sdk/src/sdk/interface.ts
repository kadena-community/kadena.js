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

/**
 * @public
 */
export interface ICrossChainTransfer extends IBaseTransfer {
  isCrossChainTransfer: true;
  targetChainId: ChainId;
  continuation?: {
    requestKey: string;
    success: boolean;
  };
}

/**
 * @public
 */
export interface IEthvmDevTokenInfo {
  currentPrice?: number;
  maxSupply?: number;
  totalSupply?: number;
  circulatingSupply?: number;
  low24h?: number;
  high24h?: number;
}

/**
 * @public
 */
export interface IChain {
  id: ChainId;
  // Will add later: type: 'pact' | 'evm'
}

/**
 * @public
 */
export type ITransfer = ISameChainTransfer | ICrossChainTransfer;

/**
 * @public
 */
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

/**
 * @public
 */
export interface ITransferResponse {
  transfers: ITransfer[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

/**
 * @public
 */
export type ICreateTransfer = Parameters<typeof transferCreateCommand>[0];

/**
 * @public
 */
export type ICreateCrossChainTransfer = Parameters<
  typeof createCrossChainCommand
>[0];

/**
 * @public
 */
export interface IAccountDetails {
  chainId: string;
  accountDetails: IAccountDetailsResult | null;
}

/**
 * @public
 */
export interface IAccountDetailsResult {
  guard: IGuard;
  account: string;
  balance:
    | number
    | {
        decimal: number;
      };
}

/**
 * @public
 */
export interface IGuard {
  keys: string[];
  pred: string;
}
/**
 * @public
 */
export interface ITransaction {
  requestKey: string;
  chainId: ChainId;
}

/**
 * @public
 */
export type RequestKey = string;

/**
 * @public
 */
export interface ITransactionDescriptor {
  requestKey: string;
  chainId: ChainId;
  networkId: string;
}

/**
 * @public
 */
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

/**
 * @public
 */
export type INodeChainInfo = Pick<INetworkInfo, 'nodeChains' | 'nodeVersion'>;

/**
 * @public
 */
export type INodeNetworkInfo = Omit<INetworkInfo, 'nodeChains'>;
