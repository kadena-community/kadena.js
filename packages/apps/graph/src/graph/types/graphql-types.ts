import type { Signer, Transaction, Transfer } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Guard {
  keys: string[];
  predicate: 'keys-all' | 'keys-any' | 'keys-two';
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface GasLimitEstimation {
  amount: number;
  inputType: string;
  usedPreflight: boolean;
  usedSignatureVerification: boolean;
  transaction: string;
}

export const NonFungibleTokenBalanceName: 'NonFungibleTokenBalance' =
  'NonFungibleTokenBalance';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface NonFungibleTokenBalance {
  tokenId: string;
  balance: number;
  accountName: string;
  chainId: string;
  guard: Guard;
  info?: NonFungibleToken;
  version: string;
}

export interface NonFungibleToken {
  supply: number;
  precision: number;
  uri: string;
  // TODO: figure out what to do with weird pact-arrays
  // policies: string[];
}

export const FungibleChainAccountName: 'FungibleChainAccount' =
  'FungibleChainAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface FungibleChainAccount {
  __typename: typeof FungibleChainAccountName;
  chainId: string;
  fungibleName: string;
  accountName: string;
  guard: Guard;
  balance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

export const FungibleAccountName: 'FungibleAccount' = 'FungibleAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface FungibleAccount {
  __typename: typeof FungibleAccountName;
  fungibleName: string;
  accountName: string;
  chainAccounts: FungibleChainAccount[];
  totalBalance: number;
  transactions: Transaction[];
  transfers: Transfer[];
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface GraphConfiguration {
  minimumBlockHeight: bigint;
}

export const NonFungibleChainAccountName: 'NonFungibleChainAccount' =
  'NonFungibleChainAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface NonFungibleChainAccount {
  __typename: typeof NonFungibleChainAccountName;
  chainId: string;
  accountName: string;
  nonFungibleTokenBalances: NonFungibleTokenBalance[];
  transactions: Transaction[];
}

export const NonFungibleAccountName: 'NonFungibleAccount' =
  'NonFungibleAccount';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface NonFungibleAccount {
  __typename: typeof NonFungibleAccountName;
  accountName: string;
  chainAccounts: NonFungibleChainAccount[];
  nonFungibleTokenBalances: NonFungibleTokenBalance[];
  transactions: Transaction[];
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TransactionCommand {
  payload: ExecutionPayload | ContinuationPayload;
  meta: TransactionMeta;
  signers: Signer[];
  networkId: string;
  nonce: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ExecutionPayload {
  code: string | null;
  data: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ContinuationPayload {
  pactId: string | null;
  step: number | null;
  rollback: boolean | null;
  data: string;
  proof: string | null;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TransactionMeta {
  sender: string;
  chainId: bigint;
  gasLimit: bigint;
  gasPrice: number;
  ttl: bigint;
  creationTime: Date;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TransactionMempoolInfo {
  status: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TransactionResult {
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

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TransactionCommand {
  payload: ExecutionPayload | ContinuationPayload;
  meta: TransactionMeta;
  signers: Signer[];
  networkId: string;
  nonce: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TransactionCapability {
  name: string;
  args: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TransactionSignature {
  sig: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface PactQueryResponse {
  status: string;
  result: string | null;
  error: string | null;
  chainId: string;
  code: string;
}
