import type { ChainId, ICommand, IUnsignedCommand } from '@kadena/client';
import type {
  createCrossChainCommand,
  simpleTransferCreateCommand,
  transferCreateCommand,
} from '@kadena/client-utils';

interface IBaseTransfer {
  senderAccount: string;
  receiverAccount: string;
  amount: string;
  token: string;
  requestKey: string;
  success: boolean;
}
type ISameChainTransfer = IBaseTransfer & {
  isCrossChainTransfer: false;
  chainId: ChainId;
};
type ICrossChainTransfer = IBaseTransfer & {
  isCrossChainTransfer: true;
  fromChainId: ChainId;
  toChainId: ChainId;
  continuation: {
    requestKey: string;
    success: boolean;
  };
};

export interface IChain {
  id: ChainId;
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
export type IAccountDetails = unknown;
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

export interface IWalletSDK {
  /** create transfer that only accepts `k:` accounts */
  createSimpleTransfer(transfer: SimpleCreateTransfer): IUnsignedCommand;
  /** create transfer that accepts any kind of account (requires keys/pred) */
  createTransfer(transfer: CreateTransfer): IUnsignedCommand;
  createCrossChainTransfer(
    transfer: CreateCrossChainTransfer,
  ): IUnsignedCommand;

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
    callback: (transfer: Transfer, transfers: Transfer[]) => void,
  ): () => void;

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
  ): () => void;

  // 1.7 kadena names support
  // chainId hardcoded to chain 15
  resolveNameToAddress(
    name: string,
    networkId: string,
  ): Promise<string | undefined>;

  // 1.7 kadena names support
  // chainId hardcoded to chain 15
  resolveAddressToName(
    address: string,
    networkId: string,
  ): Promise<string | undefined>;

  // 1.4 query balances
  getAccountDetails(
    accountName: string,
    networkId: string,
    fungible: string,
    chainIds?: ChainId[],
  ): Promise<IAccountDetails[] | undefined>;

  // 1.5 get chains
  // https://api.chainweb.com/info
  // https://api.testnet.chainweb.com/info
  getChains(networkHost: string): Promise<IChain[]>;

  // 1.3
  getGasEstimate(
    transaction: ICommand,
    networkId: string,
    networkHost: string,
  ): Promise<number>;

  getUSDPrice(currency: string): Promise<number>;
}
