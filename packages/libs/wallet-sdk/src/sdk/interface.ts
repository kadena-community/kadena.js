import type { ChainId } from '@kadena/client';
import type {
  createCrossChainCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import type { simpleTransferCreateCommand } from './utils-tmp';

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

interface ICrossChainTransfer extends IBaseTransfer {
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
export type Transfer = ISameChainTransfer | ICrossChainTransfer;
export type CreateFinishCrossChainTransfer = unknown;
export type SimpleCreateTransfer = Parameters<
  typeof simpleTransferCreateCommand
>[0];
export type CreateTransfer = Parameters<typeof transferCreateCommand>[0];
export type CreateCrossChainTransfer = Parameters<
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
