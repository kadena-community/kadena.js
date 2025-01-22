import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  PositiveFloat: { input: any; output: any; }
};

/** A unit of information that stores a set of verified transactions. */
export type Block = Node & {
  __typename?: 'Block';
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  /** The difficulty of the block. */
  difficulty: Scalars['BigInt']['output'];
  /** The moment the difficulty is adjusted to maintain a block validation time of 30 seconds. */
  epoch: Scalars['DateTime']['output'];
  /** Default page size is 20. */
  events: BlockEventsConnection;
  flags: Scalars['Decimal']['output'];
  hash: Scalars['String']['output'];
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  minerAccount: FungibleChainAccount;
  neighbors: Array<BlockNeighbor>;
  nonce: Scalars['Decimal']['output'];
  parent?: Maybe<Block>;
  payloadHash: Scalars['String']['output'];
  /** The proof of work hash. */
  powHash: Scalars['String']['output'];
  target: Scalars['Decimal']['output'];
  /** Default page size is 20. */
  transactions: BlockTransactionsConnection;
  weight: Scalars['Decimal']['output'];
};


/** A unit of information that stores a set of verified transactions. */
export type BlockEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** A unit of information that stores a set of verified transactions. */
export type BlockTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type BlockEventsConnection = {
  __typename?: 'BlockEventsConnection';
  edges: Array<BlockEventsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BlockEventsConnectionEdge = {
  __typename?: 'BlockEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

/** The neighbor of a block. */
export type BlockNeighbor = {
  __typename?: 'BlockNeighbor';
  chainId: Scalars['String']['output'];
  hash: Scalars['String']['output'];
};

export type BlockTransactionsConnection = {
  __typename?: 'BlockTransactionsConnection';
  edges: Array<BlockTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BlockTransactionsConnectionEdge = {
  __typename?: 'BlockTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/** The payload of an cont transaction. */
export type ContinuationPayload = {
  __typename?: 'ContinuationPayload';
  /** The environment data made available to the transaction. Formatted as raw JSON. */
  data: Scalars['String']['output'];
  /** A unique id when a pact (defpact) is initiated. See the "Pact execution scope and pact-id" explanation in the docs for more information. */
  pactId?: Maybe<Scalars['String']['output']>;
  /** The proof provided to continue the cross-chain transaction. */
  proof?: Maybe<Scalars['String']['output']>;
  /** Whether or not this transaction can be rolled back. */
  rollback?: Maybe<Scalars['Boolean']['output']>;
  /** The step-number when this is an execution of a `defpact`, aka multi-step transaction. */
  step?: Maybe<Scalars['Int']['output']>;
};

/** An event emitted by the execution of a smart-contract function. */
export type Event = Node & {
  __typename?: 'Event';
  block: Block;
  chainId: Scalars['BigInt']['output'];
  /** The height of the block where the event was emitted. */
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  incrementedId: Scalars['Int']['output'];
  moduleName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** The order index of this event, in the case that there are multiple events in one transaction. */
  orderIndex: Scalars['BigInt']['output'];
  parameterText: Scalars['String']['output'];
  parameters?: Maybe<Scalars['String']['output']>;
  /** The full eventname, containing module and eventname, e.g. coin.TRANSFER */
  qualifiedName: Scalars['String']['output'];
  requestKey: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
};

/** The payload of an exec transaction. */
export type ExecutionPayload = {
  __typename?: 'ExecutionPayload';
  /** The Pact expressions executed in this transaction when it is an `exec` transaction. */
  code?: Maybe<Scalars['String']['output']>;
  /** The environment data made available to the transaction. Formatted as raw JSON. */
  data: Scalars['String']['output'];
};

/** A fungible-specific account. */
export type FungibleAccount = Node & {
  __typename?: 'FungibleAccount';
  accountName: Scalars['String']['output'];
  chainAccounts: Array<FungibleChainAccount>;
  fungibleName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  totalBalance: Scalars['Decimal']['output'];
  /** Default page size is 20. */
  transactions: FungibleAccountTransactionsConnection;
  /** Default page size is 20. */
  transfers: FungibleAccountTransfersConnection;
};


/** A fungible-specific account. */
export type FungibleAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** A fungible-specific account. */
export type FungibleAccountTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type FungibleAccountTransactionsConnection = {
  __typename?: 'FungibleAccountTransactionsConnection';
  edges: Array<FungibleAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FungibleAccountTransactionsConnectionEdge = {
  __typename?: 'FungibleAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type FungibleAccountTransfersConnection = {
  __typename?: 'FungibleAccountTransfersConnection';
  edges: Array<FungibleAccountTransfersConnectionEdge>;
  pageInfo: PageInfo;
};

export type FungibleAccountTransfersConnectionEdge = {
  __typename?: 'FungibleAccountTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

/** A fungible specific chain-account. */
export type FungibleChainAccount = Node & {
  __typename?: 'FungibleChainAccount';
  accountName: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  chainId: Scalars['String']['output'];
  fungibleName: Scalars['String']['output'];
  guard: Guard;
  id: Scalars['ID']['output'];
  /** Transactions that the current account is sender of. Default page size is 20. */
  transactions: FungibleChainAccountTransactionsConnection;
  /** Default page size is 20. */
  transfers: FungibleChainAccountTransfersConnection;
};


/** A fungible specific chain-account. */
export type FungibleChainAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** A fungible specific chain-account. */
export type FungibleChainAccountTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type FungibleChainAccountTransactionsConnection = {
  __typename?: 'FungibleChainAccountTransactionsConnection';
  edges: Array<FungibleChainAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FungibleChainAccountTransactionsConnectionEdge = {
  __typename?: 'FungibleChainAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type FungibleChainAccountTransfersConnection = {
  __typename?: 'FungibleChainAccountTransfersConnection';
  edges: Array<FungibleChainAccountTransfersConnectionEdge>;
  pageInfo: PageInfo;
};

export type FungibleChainAccountTransfersConnectionEdge = {
  __typename?: 'FungibleChainAccountTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

export type GasLimitEstimation = {
  __typename?: 'GasLimitEstimation';
  amount: Scalars['Int']['output'];
  inputType: Scalars['String']['output'];
  transaction: Scalars['String']['output'];
  usedPreflight: Scalars['Boolean']['output'];
  usedSignatureVerification: Scalars['Boolean']['output'];
};

/** General information about the graph and chainweb-data. */
export type GraphConfiguration = {
  __typename?: 'GraphConfiguration';
  /** The lowest block-height that is indexed in this endpoint. */
  minimumBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** The version of the @kadena/graph package. */
  version: Scalars['String']['output'];
};

export type Guard = IGuard & {
  __typename?: 'Guard';
  keys: Array<Scalars['String']['output']>;
  predicate: Scalars['String']['output'];
  raw: Scalars['String']['output'];
};

/** A guard. Has values `keys`, `predicate` to provide backwards compatibility for `KeysetGuard`. */
export type IGuard = {
  /** @deprecated Use `... on KeysetGuard { keys predicate }` instead when working with Keysets */
  keys: Array<Scalars['String']['output']>;
  /** @deprecated Use `... on KeysetGuard { keys predicate }` instead when working with Keysets */
  predicate: Scalars['String']['output'];
  raw: Scalars['String']['output'];
};

/** The account of the miner that solved a block. */
export type MinerKey = Node & {
  __typename?: 'MinerKey';
  block: Block;
  blockHash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
};

/** Information about the network. */
export type NetworkInfo = {
  __typename?: 'NetworkInfo';
  /** The version of the API. */
  apiVersion: Scalars['String']['output'];
  /** The number of circulating coins. */
  coinsInCirculation: Scalars['Float']['output'];
  /** The network hash rate. */
  networkHashRate: Scalars['Float']['output'];
  /** The host of the network. */
  networkHost: Scalars['String']['output'];
  /** The ID of the network. */
  networkId: Scalars['String']['output'];
  /** The total difficulty. */
  totalDifficulty: Scalars['Float']['output'];
  /** The total number of transactions. */
  transactionCount: Scalars['Int']['output'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

/** A non-fungible-specific account. */
export type NonFungibleAccount = Node & {
  __typename?: 'NonFungibleAccount';
  accountName: Scalars['String']['output'];
  chainAccounts: Array<NonFungibleChainAccount>;
  id: Scalars['ID']['output'];
  nonFungibleTokenBalances: Array<NonFungibleTokenBalance>;
  /** Default page size is 20. Note that custom token related transactions are not included. */
  transactions: NonFungibleAccountTransactionsConnection;
};


/** A non-fungible-specific account. */
export type NonFungibleAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type NonFungibleAccountTransactionsConnection = {
  __typename?: 'NonFungibleAccountTransactionsConnection';
  edges: Array<NonFungibleAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NonFungibleAccountTransactionsConnectionEdge = {
  __typename?: 'NonFungibleAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/** A chain and non-fungible-specific account. */
export type NonFungibleChainAccount = Node & {
  __typename?: 'NonFungibleChainAccount';
  accountName: Scalars['String']['output'];
  chainId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nonFungibleTokenBalances: Array<NonFungibleTokenBalance>;
  /** Default page size is 20. Note that custom token related transactions are not included. */
  transactions: NonFungibleChainAccountTransactionsConnection;
};


/** A chain and non-fungible-specific account. */
export type NonFungibleChainAccountTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type NonFungibleChainAccountTransactionsConnection = {
  __typename?: 'NonFungibleChainAccountTransactionsConnection';
  edges: Array<NonFungibleChainAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NonFungibleChainAccountTransactionsConnectionEdge = {
  __typename?: 'NonFungibleChainAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

/** Information related to a token. */
export type NonFungibleToken = {
  __typename?: 'NonFungibleToken';
  precision: Scalars['Int']['output'];
  supply: Scalars['Int']['output'];
  uri: Scalars['String']['output'];
};

/** The token identifier and its balance. */
export type NonFungibleTokenBalance = Node & {
  __typename?: 'NonFungibleTokenBalance';
  accountName: Scalars['String']['output'];
  balance: Scalars['Int']['output'];
  chainId: Scalars['String']['output'];
  guard: Guard;
  id: Scalars['ID']['output'];
  info?: Maybe<NonFungibleToken>;
  tokenId: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type PactQuery = {
  chainId: Scalars['String']['input'];
  code: Scalars['String']['input'];
  data?: InputMaybe<Array<PactQueryData>>;
};

export type PactQueryData = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

/** Information related to a token. */
export type PactQueryResponse = {
  __typename?: 'PactQueryResponse';
  chainId: Scalars['String']['output'];
  code: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  result?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** Retrieve a block by hash. */
  block?: Maybe<Block>;
  /** Retrieve blocks by chain and minimal depth. Default page size is 20. */
  blocksFromDepth?: Maybe<QueryBlocksFromDepthConnection>;
  /** Retrieve blocks by chain and minimal height. Default page size is 20. */
  blocksFromHeight: QueryBlocksFromHeightConnection;
  /** Retrieve all completed blocks from a given height. Default page size is 20. */
  completedBlockHeights: QueryCompletedBlockHeightsConnection;
  /**
   * Retrieve events by qualifiedName (e.g. `coin.TRANSFER`). Default page size is 20.
   *        
   *       The parametersFilter is a stringified JSON object that matches the [JSON object property filters](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property) from Prisma.
   *        
   *       An example of such a filter parameter value: `events(parametersFilter: "{\"array_starts_with\": \"k:abcdefg\"}")`
   */
  events: QueryEventsConnection;
  /** Retrieve an fungible specific account by its name and fungible, such as coin. */
  fungibleAccount?: Maybe<FungibleAccount>;
  /** Retrieve an account by public key. */
  fungibleAccountsByPublicKey: Array<FungibleAccount>;
  /** Retrieve an account by its name and fungible, such as coin, on a specific chain. */
  fungibleChainAccount?: Maybe<FungibleChainAccount>;
  /** Retrieve a chain account by public key. */
  fungibleChainAccountsByPublicKey: Array<FungibleChainAccount>;
  /**
   * Estimate the gas limit for one or more transactions. Throws an error when the transaction fails or is invalid. The input accepts a JSON object and based on the parameters passed it will determine what type of format it is and return the gas limit estimation. The following types are supported:
   *        
   *       - `full-transaction`: A complete transaction object. Required parameters: `cmd`, `hash` and `sigs`.
   *       - `stringified-command`: A JSON stringified command. Required parameters: `cmd`. It also optionally accepts `sigs`.
   *       - `full-command`: A full command. Required parameters: `payload`, `meta` and `signers`.
   *       - `partial-command`: A partial command. Required parameters: `payload` and either `meta` or `signers`. In case `meta` is not given, but `signers` is given, you can also add `chainId` as a parameter.
   *       - `payload`: A just the payload of a command. Required parameters: `payload` and `chainId`.
   *       - `code`: The code of an execution. Required parameters: `code` and `chainId`.
   *        
   *       Every type accepts an optional parameter called `networkId` to override the default value from the environment variables.
   *        
   *       Example of the input needed for a type `code` query: `gasLimitEstimate(input: "{\"code\":\"(coin.details \\\"k:1234\\\")\",\"chainId\":\"3\"}")`
   */
  gasLimitEstimate: Array<GasLimitEstimation>;
  /** Get the configuration of the graph. */
  graphConfiguration: GraphConfiguration;
  /** Get the height of the block with the highest height. */
  lastBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Get information about the network. */
  networkInfo?: Maybe<NetworkInfo>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  /** Retrieve a non-fungible specific account by its name. */
  nonFungibleAccount?: Maybe<NonFungibleAccount>;
  /** Retrieve an account by its name on a specific chain. */
  nonFungibleChainAccount?: Maybe<NonFungibleChainAccount>;
  /** Execute arbitrary Pact code via a local call without gas-estimation or signature-verification (e.g. (+ 1 2) or (coin.get-details <account>)). */
  pactQuery: Array<PactQueryResponse>;
  /** Retrieve one transaction by its unique key. Throws an error if multiple transactions are found. */
  transaction?: Maybe<Transaction>;
  /**
   * Retrieve transactions. Default page size is 20.
   *  At least one of accountName, fungibleName, blockHash, or requestKey must be provided.
   */
  transactions: QueryTransactionsConnection;
  /** Retrieve all transactions by a given public key. */
  transactionsByPublicKey: QueryTransactionsByPublicKeyConnection;
  /** Retrieve transfers. Default page size is 20. */
  transfers: QueryTransfersConnection;
};


export type QueryBlockArgs = {
  hash: Scalars['String']['input'];
};


export type QueryBlocksFromDepthArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  minimumDepth: Scalars['Int']['input'];
};


export type QueryBlocksFromHeightArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  endHeight?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  startHeight: Scalars['Int']['input'];
};


export type QueryCompletedBlockHeightsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  completedHeights?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  heightCount?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  orderIndex?: InputMaybe<Scalars['Int']['input']>;
  parametersFilter?: InputMaybe<Scalars['String']['input']>;
  qualifiedEventName: Scalars['String']['input'];
  requestKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFungibleAccountArgs = {
  accountName: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFungibleAccountsByPublicKeyArgs = {
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  publicKey: Scalars['String']['input'];
};


export type QueryFungibleChainAccountArgs = {
  accountName: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFungibleChainAccountsByPublicKeyArgs = {
  chainId: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  publicKey: Scalars['String']['input'];
};


export type QueryGasLimitEstimateArgs = {
  input: Array<Scalars['String']['input']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryNonFungibleAccountArgs = {
  accountName: Scalars['String']['input'];
};


export type QueryNonFungibleChainAccountArgs = {
  accountName: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
};


export type QueryPactQueryArgs = {
  pactQuery: Array<PactQuery>;
};


export type QueryTransactionArgs = {
  blockHash?: InputMaybe<Scalars['String']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  requestKey: Scalars['String']['input'];
};


export type QueryTransactionsArgs = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  requestKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTransactionsByPublicKeyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  publicKey: Scalars['String']['input'];
};


export type QueryTransfersArgs = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  requestKey?: InputMaybe<Scalars['String']['input']>;
};

export type QueryBlocksFromDepthConnection = {
  __typename?: 'QueryBlocksFromDepthConnection';
  edges: Array<Maybe<QueryBlocksFromDepthConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryBlocksFromDepthConnectionEdge = {
  __typename?: 'QueryBlocksFromDepthConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

export type QueryBlocksFromHeightConnection = {
  __typename?: 'QueryBlocksFromHeightConnection';
  edges: Array<Maybe<QueryBlocksFromHeightConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryBlocksFromHeightConnectionEdge = {
  __typename?: 'QueryBlocksFromHeightConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

export type QueryCompletedBlockHeightsConnection = {
  __typename?: 'QueryCompletedBlockHeightsConnection';
  edges: Array<Maybe<QueryCompletedBlockHeightsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryCompletedBlockHeightsConnectionEdge = {
  __typename?: 'QueryCompletedBlockHeightsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Block;
};

export type QueryEventsConnection = {
  __typename?: 'QueryEventsConnection';
  edges: Array<QueryEventsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryEventsConnectionEdge = {
  __typename?: 'QueryEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export type QueryTransactionsByPublicKeyConnection = {
  __typename?: 'QueryTransactionsByPublicKeyConnection';
  edges: Array<Maybe<QueryTransactionsByPublicKeyConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryTransactionsByPublicKeyConnectionEdge = {
  __typename?: 'QueryTransactionsByPublicKeyConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type QueryTransactionsConnection = {
  __typename?: 'QueryTransactionsConnection';
  edges: Array<QueryTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryTransactionsConnectionEdge = {
  __typename?: 'QueryTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type QueryTransfersConnection = {
  __typename?: 'QueryTransfersConnection';
  edges: Array<QueryTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryTransfersConnectionEdge = {
  __typename?: 'QueryTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

/** A signer for a specific transaction. */
export type Signer = Node & {
  __typename?: 'Signer';
  /** The signer for the gas. */
  address?: Maybe<Scalars['String']['output']>;
  clist: Array<TransactionCapability>;
  id: Scalars['ID']['output'];
  orderIndex?: Maybe<Scalars['Int']['output']>;
  pubkey: Scalars['String']['output'];
  /** The signature scheme that was used to sign. */
  scheme?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /**
   * Listen for events by qualifiedName (e.g. `coin.TRANSFER`).
   *        
   *       The parametersFilter is a stringified JSON object that matches the [JSON object property filters](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property) from Prisma.
   *        
   *       An example of such a filter parameter value: `events(parametersFilter: "{\"array_starts_with\": \"k:abcdefg\"}")`
   */
  events?: Maybe<Array<Event>>;
  /** Subscribe to new blocks. */
  newBlocks?: Maybe<Array<Block>>;
  /** Subscribe to new blocks from a specific depth. */
  newBlocksFromDepth?: Maybe<Array<Block>>;
  /** Listen for a transaction by request key. */
  transaction?: Maybe<Transaction>;
};


export type SubscriptionEventsArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
  minimumDepth?: InputMaybe<Scalars['Int']['input']>;
  parametersFilter?: InputMaybe<Scalars['String']['input']>;
  qualifiedEventName: Scalars['String']['input'];
};


export type SubscriptionNewBlocksArgs = {
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type SubscriptionNewBlocksFromDepthArgs = {
  chainIds: Array<Scalars['String']['input']>;
  minimumDepth: Scalars['Int']['input'];
};


export type SubscriptionTransactionArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
  requestKey: Scalars['String']['input'];
};

/** A transaction. */
export type Transaction = Node & {
  __typename?: 'Transaction';
  cmd: TransactionCommand;
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  result: TransactionInfo;
  sigs: Array<TransactionSignature>;
};

/** List of capabilities associated with/installed by this signer. */
export type TransactionCapability = {
  __typename?: 'TransactionCapability';
  args: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** A transaction command. */
export type TransactionCommand = {
  __typename?: 'TransactionCommand';
  meta: TransactionMeta;
  /** The network id of the environment. */
  networkId: Scalars['String']['output'];
  nonce: Scalars['String']['output'];
  payload: TransactionPayload;
  signers: Array<Signer>;
};

/** The result of a transaction. */
export type TransactionInfo = TransactionMempoolInfo | TransactionResult;

/** The mempool information. */
export type TransactionMempoolInfo = {
  __typename?: 'TransactionMempoolInfo';
  /** The status of the mempool. */
  status?: Maybe<Scalars['String']['output']>;
};

/** The metadata of a transaction. */
export type TransactionMeta = {
  __typename?: 'TransactionMeta';
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  gasLimit: Scalars['BigInt']['output'];
  gasPrice: Scalars['Float']['output'];
  sender: Scalars['String']['output'];
  ttl: Scalars['BigInt']['output'];
};

/** The payload of a transaction. */
export type TransactionPayload = ContinuationPayload | ExecutionPayload;

/** The result of a transaction. */
export type TransactionResult = {
  __typename?: 'TransactionResult';
  /** The transaction result when it was successful. Formatted as raw JSON. */
  badResult?: Maybe<Scalars['String']['output']>;
  block: Block;
  /** The JSON stringified continuation in the case that it is a continuation. */
  continuation?: Maybe<Scalars['String']['output']>;
  eventCount?: Maybe<Scalars['BigInt']['output']>;
  events: TransactionResultEventsConnection;
  gas: Scalars['BigInt']['output'];
  /** The transaction result when it was successful. Formatted as raw JSON. */
  goodResult?: Maybe<Scalars['String']['output']>;
  /** The height of the block this transaction belongs to. */
  height: Scalars['BigInt']['output'];
  /** Identifier to retrieve the logs for the execution of the transaction. */
  logs?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  transactionId?: Maybe<Scalars['BigInt']['output']>;
  transfers: TransactionResultTransfersConnection;
};


/** The result of a transaction. */
export type TransactionResultEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


/** The result of a transaction. */
export type TransactionResultTransfersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type TransactionResultEventsConnection = {
  __typename?: 'TransactionResultEventsConnection';
  edges: Array<Maybe<TransactionResultEventsConnectionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TransactionResultEventsConnectionEdge = {
  __typename?: 'TransactionResultEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
};

export type TransactionResultTransfersConnection = {
  __typename?: 'TransactionResultTransfersConnection';
  edges: Array<Maybe<TransactionResultTransfersConnectionEdge>>;
  pageInfo: PageInfo;
};

export type TransactionResultTransfersConnectionEdge = {
  __typename?: 'TransactionResultTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

/** List of capabilities associated with/installed by this signer. */
export type TransactionSignature = {
  __typename?: 'TransactionSignature';
  sig: Scalars['String']['output'];
};

/** A transfer of funds from a fungible between two accounts. */
export type Transfer = Node & {
  __typename?: 'Transfer';
  amount: Scalars['Decimal']['output'];
  block: Block;
  blockHash: Scalars['String']['output'];
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  /** The counterpart of the crosschain-transfer. `null` when it is not a cross-chain-transfer. */
  crossChainTransfer?: Maybe<Transfer>;
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  moduleHash: Scalars['String']['output'];
  moduleName: Scalars['String']['output'];
  /** The order of the transfer when it is a `defpact` (multi-step transaction) execution. */
  orderIndex: Scalars['BigInt']['output'];
  receiverAccount: Scalars['String']['output'];
  requestKey: Scalars['String']['output'];
  senderAccount: Scalars['String']['output'];
  /** The transaction that initiated this transfer. */
  transaction?: Maybe<Transaction>;
};

export type EventsQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;


export type EventsQuery = { __typename?: 'Query', events: { __typename?: 'QueryEventsConnection', edges: Array<{ __typename?: 'QueryEventsConnectionEdge', node: { __typename?: 'Event', chainId: any, requestKey: string, parameters?: string | null, block: { __typename?: 'Block', height: any, creationTime: any } } }> } };

export type EventSubscriptionSubscriptionVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;


export type EventSubscriptionSubscription = { __typename?: 'Subscription', events?: Array<{ __typename?: 'Event', parameters?: string | null }> | null };

export type EventSubscriptionFilteredSubscriptionVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
  parametersFilter: Scalars['String']['input'];
}>;


export type EventSubscriptionFilteredSubscription = { __typename?: 'Subscription', events?: Array<{ __typename?: 'Event', parameters?: string | null }> | null };

export type CoreEventsFieldsFragment = { __typename?: 'Event', chainId: any, requestKey: string, parameters?: string | null, block: { __typename?: 'Block', height: any, creationTime: any } };

export type InvestorTransfersEventsQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
  parametersFilter: Scalars['String']['input'];
}>;


export type InvestorTransfersEventsQuery = { __typename?: 'Query', events: { __typename?: 'QueryEventsConnection', edges: Array<{ __typename?: 'QueryEventsConnectionEdge', node: { __typename?: 'Event', requestKey: string, parameterText: string, block: { __typename?: 'Block', creationTime: any } } }> } };

export type NetworkInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type NetworkInfoQuery = { __typename?: 'Query', networkInfo?: { __typename?: 'NetworkInfo', apiVersion: string } | null };

export type TransactionSubscriptionVariables = Exact<{
  requestKey: Scalars['String']['input'];
}>;


export type TransactionSubscription = { __typename?: 'Subscription', transaction?: { __typename?: 'Transaction', result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', badResult?: string | null, goodResult?: string | null } } | null };

export const CoreEventsFieldsFragmentDoc = gql`
    fragment CoreEventsFields on Event {
  chainId
  block {
    height
    creationTime
  }
  requestKey
  parameters
}
    `;
export const EventsDocument = gql`
    query events($qualifiedName: String!) {
  events(qualifiedEventName: $qualifiedName) {
    edges {
      node {
        ...CoreEventsFields
      }
    }
  }
}
    ${CoreEventsFieldsFragmentDoc}`;

/**
 * __useEventsQuery__
 *
 * To run a query within a React component, call `useEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsQuery({
 *   variables: {
 *      qualifiedName: // value for 'qualifiedName'
 *   },
 * });
 */
export function useEventsQuery(baseOptions: Apollo.QueryHookOptions<EventsQuery, EventsQueryVariables> & ({ variables: EventsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
      }
export function useEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsQuery, EventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
        }
export function useEventsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventsQuery, EventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
        }
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
export type EventsSuspenseQueryHookResult = ReturnType<typeof useEventsSuspenseQuery>;
export type EventsQueryResult = Apollo.QueryResult<EventsQuery, EventsQueryVariables>;
export const EventSubscriptionDocument = gql`
    subscription eventSubscription($qualifiedName: String!) {
  events(qualifiedEventName: $qualifiedName) {
    parameters
  }
}
    `;

/**
 * __useEventSubscriptionSubscription__
 *
 * To run a query within a React component, call `useEventSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useEventSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventSubscriptionSubscription({
 *   variables: {
 *      qualifiedName: // value for 'qualifiedName'
 *   },
 * });
 */
export function useEventSubscriptionSubscription(baseOptions: Apollo.SubscriptionHookOptions<EventSubscriptionSubscription, EventSubscriptionSubscriptionVariables> & ({ variables: EventSubscriptionSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<EventSubscriptionSubscription, EventSubscriptionSubscriptionVariables>(EventSubscriptionDocument, options);
      }
export type EventSubscriptionSubscriptionHookResult = ReturnType<typeof useEventSubscriptionSubscription>;
export type EventSubscriptionSubscriptionResult = Apollo.SubscriptionResult<EventSubscriptionSubscription>;
export const EventSubscriptionFilteredDocument = gql`
    subscription eventSubscriptionFiltered($qualifiedName: String!, $parametersFilter: String!) {
  events(qualifiedEventName: $qualifiedName, parametersFilter: $parametersFilter) {
    parameters
  }
}
    `;

/**
 * __useEventSubscriptionFilteredSubscription__
 *
 * To run a query within a React component, call `useEventSubscriptionFilteredSubscription` and pass it any options that fit your needs.
 * When your component renders, `useEventSubscriptionFilteredSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventSubscriptionFilteredSubscription({
 *   variables: {
 *      qualifiedName: // value for 'qualifiedName'
 *      parametersFilter: // value for 'parametersFilter'
 *   },
 * });
 */
export function useEventSubscriptionFilteredSubscription(baseOptions: Apollo.SubscriptionHookOptions<EventSubscriptionFilteredSubscription, EventSubscriptionFilteredSubscriptionVariables> & ({ variables: EventSubscriptionFilteredSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<EventSubscriptionFilteredSubscription, EventSubscriptionFilteredSubscriptionVariables>(EventSubscriptionFilteredDocument, options);
      }
export type EventSubscriptionFilteredSubscriptionHookResult = ReturnType<typeof useEventSubscriptionFilteredSubscription>;
export type EventSubscriptionFilteredSubscriptionResult = Apollo.SubscriptionResult<EventSubscriptionFilteredSubscription>;
export const InvestorTransfersEventsDocument = gql`
    query investorTransfersEvents($qualifiedName: String!, $parametersFilter: String!) {
  events(qualifiedEventName: $qualifiedName, parametersFilter: $parametersFilter) {
    edges {
      node {
        requestKey
        parameterText
        block {
          creationTime
        }
      }
    }
  }
}
    `;

/**
 * __useInvestorTransfersEventsQuery__
 *
 * To run a query within a React component, call `useInvestorTransfersEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvestorTransfersEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvestorTransfersEventsQuery({
 *   variables: {
 *      qualifiedName: // value for 'qualifiedName'
 *      parametersFilter: // value for 'parametersFilter'
 *   },
 * });
 */
export function useInvestorTransfersEventsQuery(baseOptions: Apollo.QueryHookOptions<InvestorTransfersEventsQuery, InvestorTransfersEventsQueryVariables> & ({ variables: InvestorTransfersEventsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvestorTransfersEventsQuery, InvestorTransfersEventsQueryVariables>(InvestorTransfersEventsDocument, options);
      }
export function useInvestorTransfersEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvestorTransfersEventsQuery, InvestorTransfersEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvestorTransfersEventsQuery, InvestorTransfersEventsQueryVariables>(InvestorTransfersEventsDocument, options);
        }
export function useInvestorTransfersEventsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<InvestorTransfersEventsQuery, InvestorTransfersEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<InvestorTransfersEventsQuery, InvestorTransfersEventsQueryVariables>(InvestorTransfersEventsDocument, options);
        }
export type InvestorTransfersEventsQueryHookResult = ReturnType<typeof useInvestorTransfersEventsQuery>;
export type InvestorTransfersEventsLazyQueryHookResult = ReturnType<typeof useInvestorTransfersEventsLazyQuery>;
export type InvestorTransfersEventsSuspenseQueryHookResult = ReturnType<typeof useInvestorTransfersEventsSuspenseQuery>;
export type InvestorTransfersEventsQueryResult = Apollo.QueryResult<InvestorTransfersEventsQuery, InvestorTransfersEventsQueryVariables>;
export const NetworkInfoDocument = gql`
    query networkInfo {
  networkInfo {
    apiVersion
  }
}
    `;

/**
 * __useNetworkInfoQuery__
 *
 * To run a query within a React component, call `useNetworkInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useNetworkInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNetworkInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useNetworkInfoQuery(baseOptions?: Apollo.QueryHookOptions<NetworkInfoQuery, NetworkInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NetworkInfoQuery, NetworkInfoQueryVariables>(NetworkInfoDocument, options);
      }
export function useNetworkInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NetworkInfoQuery, NetworkInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NetworkInfoQuery, NetworkInfoQueryVariables>(NetworkInfoDocument, options);
        }
export function useNetworkInfoSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NetworkInfoQuery, NetworkInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NetworkInfoQuery, NetworkInfoQueryVariables>(NetworkInfoDocument, options);
        }
export type NetworkInfoQueryHookResult = ReturnType<typeof useNetworkInfoQuery>;
export type NetworkInfoLazyQueryHookResult = ReturnType<typeof useNetworkInfoLazyQuery>;
export type NetworkInfoSuspenseQueryHookResult = ReturnType<typeof useNetworkInfoSuspenseQuery>;
export type NetworkInfoQueryResult = Apollo.QueryResult<NetworkInfoQuery, NetworkInfoQueryVariables>;
export const TransactionDocument = gql`
    subscription transaction($requestKey: String!) {
  transaction(requestKey: $requestKey) {
    result {
      ... on TransactionResult {
        badResult
        goodResult
      }
    }
  }
}
    `;

/**
 * __useTransactionSubscription__
 *
 * To run a query within a React component, call `useTransactionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTransactionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionSubscription({
 *   variables: {
 *      requestKey: // value for 'requestKey'
 *   },
 * });
 */
export function useTransactionSubscription(baseOptions: Apollo.SubscriptionHookOptions<TransactionSubscription, TransactionSubscriptionVariables> & ({ variables: TransactionSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TransactionSubscription, TransactionSubscriptionVariables>(TransactionDocument, options);
      }
export type TransactionSubscriptionHookResult = ReturnType<typeof useTransactionSubscription>;
export type TransactionSubscriptionResult = Apollo.SubscriptionResult<TransactionSubscription>;