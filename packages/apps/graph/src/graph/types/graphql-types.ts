import type { Signer, Transaction, Transfer } from '@prisma/client';

export interface IGuard {
  keys: string[];
  predicate: 'keys-all' | 'keys-any' | 'keys-two';
}

export interface IGasLimitEstimation {
  amount: number;
  inputType: string;
  usedPreflight: boolean;
  usedSignatureVerification: boolean;
  transaction: string;
}

export const NonFungibleTokenBalanceName: 'NonFungibleTokenBalance' =
  'NonFungibleTokenBalance';

export interface INonFungibleTokenBalance {
  __typename: typeof NonFungibleTokenBalanceName;
  tokenId: string;
  balance: number;
  accountName: string;
  chainId: string;
  guard: IGuard;
  info?: INonFungibleToken;
  version: string;
}

export interface INonFungibleToken {
  supply: number;
  precision: number;
  uri: string;
  // TODO: figure out what to do with weird pact-arrays
  // policies: string[];
}

export const FungibleChainAccountName: 'FungibleChainAccount' =
  'FungibleChainAccount';

export interface IFungibleChainAccount {
  __typename: typeof FungibleChainAccountName;
  chainId: string;
  fungibleName: string;
  accountName: string;
  guard: IGuard;
  balance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

export const FungibleAccountName: 'FungibleAccount' = 'FungibleAccount';

export interface IFungibleAccount {
  __typename: typeof FungibleAccountName;
  fungibleName: string;
  accountName: string;
  chainAccounts: IFungibleChainAccount[];
  totalBalance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

export interface IGraphConfiguration {
  minimumBlockHeight: bigint;
}

export const NonFungibleChainAccountName: 'NonFungibleChainAccount' =
  'NonFungibleChainAccount';

export interface INonFungibleChainAccount {
  __typename: typeof NonFungibleChainAccountName;
  chainId: string;
  accountName: string;
  nonFungibleTokenBalances: INonFungibleTokenBalance[];
  transactions: Transaction[];
}

export const NonFungibleAccountName: 'NonFungibleAccount' =
  'NonFungibleAccount';

export interface INonFungibleAccount {
  __typename: typeof NonFungibleAccountName;
  accountName: string;
  chainAccounts: INonFungibleChainAccount[];
  nonFungibleTokenBalances: INonFungibleTokenBalance[];
  transactions: Transaction[];
}

export interface ITransactionCommand {
  payload: IExecutionPayload | IContinuationPayload;
  meta: ITransactionMeta;
  signers: Signer[];
  networkId: string;
  nonce: string;
}

export interface IExecutionPayload {
  code: string | null;
  data: string;
}

export interface IContinuationPayload {
  pactId: string | null;
  step: number | null;
  rollback: boolean | null;
  data: string;
  proof: string | null;
}

export interface ITransactionMeta {
  sender: string;
  chainId: bigint;
  gasLimit: bigint;
  gasPrice: number;
  ttl: bigint;
  creationTime: Date;
}

export interface ITransactionMempoolInfo {
  status: string;
}

export interface ITransactionResult {
  hash: string;
  chainId: bigint;
  badResult: string | null;
  blockHash: string;
  continuation: string | null;
  gas: bigint;
  goodResult: string | null;
  height: bigint;
  logs: string | null;
  metadata: string | null;
  eventCount: bigint | null;
  transactionId: bigint | null;
}

export interface ITransactionCommand {
  payload: IExecutionPayload | IContinuationPayload;
  meta: ITransactionMeta;
  signers: Signer[];
  networkId: string;
  nonce: string;
}

export interface ITransactionCapability {
  name: string;
  args: string;
}

export interface ITransactionSignature {
  sig: string;
}

export interface IPactQueryResponse {
  status: string;
  result: string | null;
  error: string | null;
  chainId: string;
  code: string;
}

export interface INetworkInfo {
  networkHost: string;
  networkId: string;
  apiVersion: string;
  coinsInCirculation: number;
  transactionCount: number;
}
