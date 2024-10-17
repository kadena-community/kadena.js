import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/client';
import type {
  createCrossChainCommand,
  simpleTransferCreateCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import type { ResponseResult } from './schema.js';

interface IBaseTransfer {
  senderAccount: string;
  receiverAccount: string;
  amount: string;
  token: string;
  requestKey: string;
  success: boolean;
  chainId: ChainId;
}
interface ISameChainTransfer extends IBaseTransfer {
  isCrossChainTransfer: false;
}

interface ICrossChainTransfer extends IBaseTransfer {
  isCrossChainTransfer: true;
  targetChainId: ChainId;
  continuation: {
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

/** @deprecated should just be defined in the WalletSDK class */
export interface IWalletSDK {
  /** create transfer that only accepts `k:` accounts */
  createSimpleTransfer(transfer: SimpleCreateTransfer): IUnsignedCommand;
  /** create transfer that accepts any kind of account (requires keys/pred) */
  createTransfer(transfer: CreateTransfer): IUnsignedCommand;
  createCrossChainTransfer(
    transfer: CreateCrossChainTransfer,
  ): IUnsignedCommand;

  // TODO: needs spv proof, not sure how to do it currently
  createFinishCrossChainTransfer(
    transfer: CreateFinishCrossChainTransfer,
  ): IUnsignedCommand;

  /** Sends transaction to chainweb-node, returns requestKey */
  sendTransaction(
    transaction: ICommand,
    chainId: ChainId,
    networkId: string,
  ): Promise<ITransactionDescriptor>;

  getTransactions(
    accountName: string,
    fungible: string,
    networkId: string,
    chainsIds: ChainId[],
  ): Promise<ITransaction[]>;

  getTransfers(
    accountName: string,
    fungible: string,
    networkId: string,
    chainsIds: ChainId[],
  ): Promise<Transfer[]>;

  // 1.6.2 updates for transfers
  /**
   * Subscribe to transfer changes, the only changes that can happen here is incomplete cross-chain transfers finishing.
   * Returns callback to unsubscribe.
   */
  subscribeOnCrossChainComplete(
    transfers: ITransactionDescriptor[],
    callback: (transfer: Transfer) => void,
    options?: { signal?: AbortSignal },
  ): void;

  // Note: use /poll endpoint
  waitForPendingTransaction(
    transaction: ITransactionDescriptor,
    options?: { signal?: AbortSignal },
  ): Promise<ResponseResult>;

  // optimization: /poll accepts multiple requestKeys to check for multiple transactions at once (per chain)
  // 1.6 transactions
  /**
   * Based on requestKeys, receive an update on the callback when the transaction finished.
   * Note! should also wait for graphql to have the data?? (must be indexed by chainweb-data)
   * when /listen is complete, also poll graphql for the transaction
   * @param requestKeys
   * @param callback
   */
  subscribePendingTransactions(
    transactions: ITransactionDescriptor[],
    callback: (transaction: ITransaction) => void,
    options?: { signal?: AbortSignal },
  ): void;

  // kadenaNames: {
  //   // 1.7 kadena names support
  //   // chainId hardcoded to chain 15
  //   /** be specific about this being part of `KadenaNames` */
  //   nameToAddress(name: string, networkId: string): Promise<string | undefined>;

  //   // 1.7 kadena names support
  //   // chainId hardcoded to chain 15
  //   addressToName(
  //     address: string,
  //     networkId: string,
  //   ): Promise<string | undefined>;
  // };

  // 1.4 query balances
  getAccountDetails(
    accountName: string,
    networkId: string,
    fungible: string,
    chainIds?: ChainId[],
  ): Promise<IAccountDetails[]>;

  // 1.5 get chains
  // https://api.chainweb.com/info
  // https://api.testnet.chainweb.com/info
  getChains(networkHost: string): Promise<IChain[]>;

  // 1.5 get chains
  // https://api.chainweb.com/info
  // https://api.testnet.chainweb.com/info
  getNetworkInfo(networkHost: string): Promise<unknown>;

  // 1.3
  /** returns gasLimit */
  getGasLimitEstimate(
    transaction: ICommand,
    networkId: string,
    networkHost: string,
  ): Promise<number>;

  // Out of scope for MVP
  // getGasPriceEstimate can return gasPrice but needs to include an argument for in how many blocks it should be mined

  exchange: {
    // format `get<platform><fungible><currency>Price()`
    getEthvmDevTokenInfo<T extends string>(
      tokens: T[],
    ): Promise<Record<T, IEthvmDevTokenInfo | undefined>>;
    // TODO: implement kdswap prices which includes other fungibles
  };
}
