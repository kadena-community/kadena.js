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

export type AccountTransactionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountTransactionsQuery = { __typename?: 'Query', node?: { __typename?: 'Block' } | { __typename?: 'Event' } | { __typename?: 'FungibleAccount', transactions: { __typename?: 'FungibleAccountTransactionsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null }, edges: Array<{ __typename?: 'FungibleAccountTransactionsConnectionEdge', node: { __typename?: 'Transaction', hash: string, cmd: { __typename?: 'TransactionCommand', meta: { __typename?: 'TransactionMeta', sender: string, chainId: any }, payload: { __typename?: 'ContinuationPayload' } | { __typename?: 'ExecutionPayload', code?: string | null } }, result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', badResult?: string | null, goodResult?: string | null, block: { __typename?: 'Block', height: any } } } }> } } | { __typename?: 'FungibleChainAccount' } | { __typename?: 'MinerKey' } | { __typename?: 'NonFungibleAccount' } | { __typename?: 'NonFungibleChainAccount' } | { __typename?: 'NonFungibleTokenBalance' } | { __typename?: 'Signer' } | { __typename?: 'Transaction' } | { __typename?: 'Transfer' } | null };

export type AccountTransfersQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountTransfersQuery = { __typename?: 'Query', node?: { __typename?: 'Block' } | { __typename?: 'Event' } | { __typename?: 'FungibleAccount', transfers: { __typename?: 'FungibleAccountTransfersConnection', pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null }, edges: Array<{ __typename?: 'FungibleAccountTransfersConnectionEdge', node: { __typename?: 'Transfer', requestKey: string, blockHash: string, amount: any, chainId: any, receiverAccount: string, senderAccount: string, height: any } }> } } | { __typename?: 'FungibleChainAccount' } | { __typename?: 'MinerKey' } | { __typename?: 'NonFungibleAccount' } | { __typename?: 'NonFungibleChainAccount' } | { __typename?: 'NonFungibleTokenBalance' } | { __typename?: 'Signer' } | { __typename?: 'Transaction' } | { __typename?: 'Transfer' } | null };

export type BlockTransactionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;


export type BlockTransactionsQuery = { __typename?: 'Query', node?: { __typename?: 'Block', hash: string, transactions: { __typename?: 'BlockTransactionsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null }, edges: Array<{ __typename?: 'BlockTransactionsConnectionEdge', cursor: string, node: { __typename?: 'Transaction', id: string, hash: string, cmd: { __typename?: 'TransactionCommand', meta: { __typename?: 'TransactionMeta', sender: string }, payload: { __typename?: 'ContinuationPayload' } | { __typename?: 'ExecutionPayload', code?: string | null } }, result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', badResult?: string | null, goodResult?: string | null, continuation?: string | null } } }> } } | { __typename?: 'Event' } | { __typename?: 'FungibleAccount' } | { __typename?: 'FungibleChainAccount' } | { __typename?: 'MinerKey' } | { __typename?: 'NonFungibleAccount' } | { __typename?: 'NonFungibleChainAccount' } | { __typename?: 'NonFungibleTokenBalance' } | { __typename?: 'Signer' } | { __typename?: 'Transaction' } | { __typename?: 'Transfer' } | null };

export type CoreAccountFieldsFragment = { __typename?: 'FungibleAccount', accountName: string, totalBalance: any, chainAccounts: Array<{ __typename?: 'FungibleChainAccount', chainId: string, balance: number, guard: { __typename?: 'Guard', keys: Array<string>, predicate: string } }> };

export type CoreBlockFieldsFragment = { __typename?: 'Block', id: string, height: any, hash: string, chainId: any, creationTime: any, difficulty: any };

export type AllBlockFieldsFragment = { __typename?: 'Block', epoch: any, id: string, weight: any, payloadHash: string, powHash: string, target: any, flags: any, nonce: any, height: any, hash: string, chainId: any, creationTime: any, difficulty: any };

export type CoreEventsFieldsFragment = { __typename?: 'Event', chainId: any, requestKey: string, parameters?: string | null, block: { __typename?: 'Block', height: any } };

export type CoreTransactionFieldsFragment = { __typename?: 'Transaction', hash: string, cmd: { __typename?: 'TransactionCommand', meta: { __typename?: 'TransactionMeta', sender: string, chainId: any }, payload: { __typename?: 'ContinuationPayload' } | { __typename?: 'ExecutionPayload', code?: string | null } }, result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', badResult?: string | null, goodResult?: string | null, block: { __typename?: 'Block', height: any } } };

export type AllTransactionFieldsFragment = { __typename?: 'Transaction', id: string, hash: string, cmd: { __typename?: 'TransactionCommand', networkId: string, nonce: string, meta: { __typename?: 'TransactionMeta', creationTime: any, gasLimit: any, gasPrice: number, ttl: any, sender: string, chainId: any }, payload: { __typename?: 'ContinuationPayload', data: string, pactId?: string | null, proof?: string | null, rollback?: boolean | null, step?: number | null } | { __typename?: 'ExecutionPayload', data: string, code?: string | null }, signers: Array<{ __typename?: 'Signer', id: string, address?: string | null, orderIndex?: number | null, pubkey: string, scheme?: string | null, clist: Array<{ __typename?: 'TransactionCapability', args: string, name: string }> }> }, result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', badResult?: string | null, goodResult?: string | null, block: { __typename?: 'Block', height: any } } };

export type TransactionRequestKeyQueryVariables = Exact<{
  requestKey: Scalars['String']['input'];
}>;


export type TransactionRequestKeyQuery = { __typename?: 'Query', transaction?: { __typename?: 'Transaction', id: string, hash: string, sigs: Array<{ __typename?: 'TransactionSignature', sig: string }>, cmd: { __typename?: 'TransactionCommand', networkId: string, nonce: string, payload: { __typename: 'ContinuationPayload', data: string, pactId?: string | null, proof?: string | null, rollback?: boolean | null, step?: number | null } | { __typename: 'ExecutionPayload', data: string, code?: string | null }, meta: { __typename?: 'TransactionMeta', chainId: any, gasLimit: any, gasPrice: number, sender: string, ttl: any, creationTime: any }, signers: Array<{ __typename?: 'Signer', pubkey: string, scheme?: string | null, clist: Array<{ __typename?: 'TransactionCapability', args: string, name: string }> }> }, result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', goodResult?: string | null, badResult?: string | null, transactionId?: any | null, logs?: string | null, gas: any, metadata?: string | null, continuation?: string | null, block: { __typename?: 'Block', height: any, hash: string, creationTime: any }, events: { __typename?: 'TransactionResultEventsConnection', edges: Array<{ __typename?: 'TransactionResultEventsConnectionEdge', node: { __typename?: 'Event', qualifiedName: string, parameters?: string | null } } | null> }, transfers: { __typename?: 'TransactionResultTransfersConnection', edges: Array<{ __typename?: 'TransactionResultTransfersConnectionEdge', node: { __typename?: 'Transfer', crossChainTransfer?: { __typename?: 'Transfer', requestKey: string, senderAccount: string, receiverAccount: string } | null } } | null> } } } | null };

export type AccountQueryVariables = Exact<{
  accountName: Scalars['String']['input'];
}>;


export type AccountQuery = { __typename?: 'Query', fungibleAccount?: { __typename?: 'FungibleAccount', accountName: string, totalBalance: any, chainAccounts: Array<{ __typename?: 'FungibleChainAccount', chainId: string, balance: number, guard: { __typename?: 'Guard', keys: Array<string>, predicate: string } }> } | null };

export type CoreAccountQueryVariables = Exact<{
  accountName: Scalars['String']['input'];
}>;


export type CoreAccountQuery = { __typename?: 'Query', fungibleAccount?: { __typename?: 'FungibleAccount', accountName: string, totalBalance: any, chainAccounts: Array<{ __typename?: 'FungibleChainAccount', chainId: string, balance: number, guard: { __typename?: 'Guard', keys: Array<string>, predicate: string } }> } | null };

export type BlocksFromHeightQueryVariables = Exact<{
  startHeight: Scalars['Int']['input'];
  endHeight: Scalars['Int']['input'];
  first: Scalars['Int']['input'];
}>;


export type BlocksFromHeightQuery = { __typename?: 'Query', blocksFromHeight: { __typename?: 'QueryBlocksFromHeightConnection', edges: Array<{ __typename?: 'QueryBlocksFromHeightConnectionEdge', node: { __typename?: 'Block', height: any, hash: string, chainId: any } } | null> } };

export type BlockQueryVariables = Exact<{
  hash: Scalars['String']['input'];
}>;


export type BlockQuery = { __typename?: 'Query', block?: { __typename?: 'Block', hash: string, epoch: any, id: string, weight: any, payloadHash: string, powHash: string, target: any, flags: any, nonce: any, height: any, chainId: any, creationTime: any, difficulty: any, parent?: { __typename?: 'Block', hash: string } | null, minerAccount: { __typename?: 'FungibleChainAccount', accountName: string, guard: { __typename?: 'Guard', keys: Array<string>, predicate: string } }, neighbors: Array<{ __typename?: 'BlockNeighbor', chainId: string, hash: string }>, transactions: { __typename?: 'BlockTransactionsConnection', totalCount: number } } | null };

export type CoreBlocksFromHeightQueryVariables = Exact<{
  startHeight: Scalars['Int']['input'];
  endHeight?: InputMaybe<Scalars['Int']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type CoreBlocksFromHeightQuery = { __typename?: 'Query', blocksFromHeight: { __typename?: 'QueryBlocksFromHeightConnection', edges: Array<{ __typename?: 'QueryBlocksFromHeightConnectionEdge', node: { __typename?: 'Block', id: string, height: any, hash: string, chainId: any, creationTime: any, difficulty: any, transactions: { __typename?: 'BlockTransactionsConnection', totalCount: number } } } | null> } };

export type CompletedBlockHeightsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  chainIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  completedHeights?: InputMaybe<Scalars['Boolean']['input']>;
  heightCount?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CompletedBlockHeightsQuery = { __typename?: 'Query', completedBlockHeights: { __typename?: 'QueryCompletedBlockHeightsConnection', edges: Array<{ __typename?: 'QueryCompletedBlockHeightsConnectionEdge', node: { __typename?: 'Block', id: string, height: any, hash: string, chainId: any, creationTime: any, difficulty: any, transactions: { __typename?: 'BlockTransactionsConnection', totalCount: number } } } | null> } };

export type EventsQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
}>;


export type EventsQuery = { __typename?: 'Query', events: { __typename?: 'QueryEventsConnection', edges: Array<{ __typename?: 'QueryEventsConnectionEdge', node: { __typename?: 'Event', chainId: any, requestKey: string, parameters?: string | null, block: { __typename?: 'Block', height: any } } }> } };

export type LastBlockHeightQueryVariables = Exact<{ [key: string]: never; }>;


export type LastBlockHeightQuery = { __typename?: 'Query', lastBlockHeight?: any | null };

export type NetworkInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type NetworkInfoQuery = { __typename?: 'Query', networkInfo?: { __typename?: 'NetworkInfo', apiVersion: string, networkHost: string, networkId: string, transactionCount: number, coinsInCirculation: number, networkHashRate: number, totalDifficulty: number } | null };

export type TransactionsQueryVariables = Exact<{
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  accountName?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: { __typename?: 'QueryTransactionsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean }, edges: Array<{ __typename?: 'QueryTransactionsConnectionEdge', node: { __typename?: 'Transaction', id: string, hash: string, cmd: { __typename?: 'TransactionCommand', networkId: string, nonce: string, meta: { __typename?: 'TransactionMeta', creationTime: any, gasLimit: any, gasPrice: number, ttl: any, sender: string, chainId: any }, payload: { __typename?: 'ContinuationPayload', data: string, pactId?: string | null, proof?: string | null, rollback?: boolean | null, step?: number | null } | { __typename?: 'ExecutionPayload', data: string, code?: string | null }, signers: Array<{ __typename?: 'Signer', id: string, address?: string | null, orderIndex?: number | null, pubkey: string, scheme?: string | null, clist: Array<{ __typename?: 'TransactionCapability', args: string, name: string }> }> }, result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', badResult?: string | null, goodResult?: string | null, block: { __typename?: 'Block', height: any } } } }> } };

export type TransactionQueryVariables = Exact<{
  requestKey: Scalars['String']['input'];
}>;


export type TransactionQuery = { __typename?: 'Query', transaction?: { __typename?: 'Transaction', hash: string, cmd: { __typename?: 'TransactionCommand', meta: { __typename?: 'TransactionMeta', sender: string, chainId: any }, payload: { __typename?: 'ContinuationPayload' } | { __typename?: 'ExecutionPayload', code?: string | null } }, result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', badResult?: string | null, goodResult?: string | null, block: { __typename?: 'Block', height: any } } } | null };

export type NewBlocksSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewBlocksSubscription = { __typename?: 'Subscription', newBlocks?: Array<{ __typename?: 'Block', id: string, height: any, hash: string, chainId: any, creationTime: any, difficulty: any, transactions: { __typename?: 'BlockTransactionsConnection', totalCount: number, edges: Array<{ __typename?: 'BlockTransactionsConnectionEdge', node: { __typename?: 'Transaction', hash: string, cmd: { __typename?: 'TransactionCommand', meta: { __typename?: 'TransactionMeta', sender: string, chainId: any }, payload: { __typename?: 'ContinuationPayload' } | { __typename?: 'ExecutionPayload', code?: string | null } }, result: { __typename?: 'TransactionMempoolInfo' } | { __typename?: 'TransactionResult', badResult?: string | null, goodResult?: string | null, block: { __typename?: 'Block', height: any } } } }> } }> | null };

export const CoreAccountFieldsFragmentDoc = gql`
    fragment CoreAccountFields on FungibleAccount {
  accountName
  totalBalance
  chainAccounts {
    chainId
    balance
    guard {
      keys
      predicate
    }
  }
}
    `;
export const CoreBlockFieldsFragmentDoc = gql`
    fragment CoreBlockFields on Block {
  id
  height
  hash
  chainId
  creationTime
  difficulty
}
    `;
export const AllBlockFieldsFragmentDoc = gql`
    fragment AllBlockFields on Block {
  ...CoreBlockFields
  epoch
  id
  weight
  payloadHash
  powHash
  target
  flags
  nonce
}
    ${CoreBlockFieldsFragmentDoc}`;
export const CoreEventsFieldsFragmentDoc = gql`
    fragment CoreEventsFields on Event {
  chainId
  block {
    height
  }
  requestKey
  parameters
}
    `;
export const CoreTransactionFieldsFragmentDoc = gql`
    fragment CoreTransactionFields on Transaction {
  hash
  cmd {
    meta {
      sender
      chainId
    }
    payload {
      ... on ExecutionPayload {
        code
      }
    }
  }
  result {
    ... on TransactionResult {
      badResult
      goodResult
      block {
        height
      }
    }
  }
}
    `;
export const AllTransactionFieldsFragmentDoc = gql`
    fragment AllTransactionFields on Transaction {
  ...CoreTransactionFields
  id
  cmd {
    meta {
      creationTime
      gasLimit
      gasPrice
      ttl
    }
    networkId
    nonce
    payload {
      ... on ContinuationPayload {
        data
        pactId
        proof
        rollback
        step
      }
      ... on ExecutionPayload {
        data
      }
    }
    signers {
      id
      address
      clist {
        args
        name
      }
      orderIndex
      pubkey
      scheme
    }
  }
}
    ${CoreTransactionFieldsFragmentDoc}`;
export const AccountTransactionsDocument = gql`
    query accountTransactions($id: ID!, $first: Int, $last: Int, $after: String, $before: String) {
  node(id: $id) {
    ... on FungibleAccount {
      transactions(first: $first, after: $after, last: $last, before: $before) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges {
          node {
            hash
            cmd {
              meta {
                sender
                chainId
              }
              payload {
                ... on ExecutionPayload {
                  code
                }
              }
            }
            result {
              ... on TransactionResult {
                badResult
                goodResult
                block {
                  height
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useAccountTransactionsQuery__
 *
 * To run a query within a React component, call `useAccountTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountTransactionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useAccountTransactionsQuery(baseOptions: Apollo.QueryHookOptions<AccountTransactionsQuery, AccountTransactionsQueryVariables> & ({ variables: AccountTransactionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountTransactionsQuery, AccountTransactionsQueryVariables>(AccountTransactionsDocument, options);
      }
export function useAccountTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountTransactionsQuery, AccountTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountTransactionsQuery, AccountTransactionsQueryVariables>(AccountTransactionsDocument, options);
        }
export function useAccountTransactionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AccountTransactionsQuery, AccountTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountTransactionsQuery, AccountTransactionsQueryVariables>(AccountTransactionsDocument, options);
        }
export type AccountTransactionsQueryHookResult = ReturnType<typeof useAccountTransactionsQuery>;
export type AccountTransactionsLazyQueryHookResult = ReturnType<typeof useAccountTransactionsLazyQuery>;
export type AccountTransactionsSuspenseQueryHookResult = ReturnType<typeof useAccountTransactionsSuspenseQuery>;
export type AccountTransactionsQueryResult = Apollo.QueryResult<AccountTransactionsQuery, AccountTransactionsQueryVariables>;
export const AccountTransfersDocument = gql`
    query accountTransfers($id: ID!, $first: Int, $last: Int, $after: String, $before: String) {
  node(id: $id) {
    ... on FungibleAccount {
      transfers(first: $first, after: $after, last: $last, before: $before) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        edges {
          node {
            requestKey
            blockHash
            amount
            chainId
            receiverAccount
            senderAccount
            height
          }
        }
      }
    }
  }
}
    `;

/**
 * __useAccountTransfersQuery__
 *
 * To run a query within a React component, call `useAccountTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountTransfersQuery({
 *   variables: {
 *      id: // value for 'id'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useAccountTransfersQuery(baseOptions: Apollo.QueryHookOptions<AccountTransfersQuery, AccountTransfersQueryVariables> & ({ variables: AccountTransfersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountTransfersQuery, AccountTransfersQueryVariables>(AccountTransfersDocument, options);
      }
export function useAccountTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountTransfersQuery, AccountTransfersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountTransfersQuery, AccountTransfersQueryVariables>(AccountTransfersDocument, options);
        }
export function useAccountTransfersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AccountTransfersQuery, AccountTransfersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountTransfersQuery, AccountTransfersQueryVariables>(AccountTransfersDocument, options);
        }
export type AccountTransfersQueryHookResult = ReturnType<typeof useAccountTransfersQuery>;
export type AccountTransfersLazyQueryHookResult = ReturnType<typeof useAccountTransfersLazyQuery>;
export type AccountTransfersSuspenseQueryHookResult = ReturnType<typeof useAccountTransfersSuspenseQuery>;
export type AccountTransfersQueryResult = Apollo.QueryResult<AccountTransfersQuery, AccountTransfersQueryVariables>;
export const BlockTransactionsDocument = gql`
    query blockTransactions($id: ID!, $first: Int, $last: Int, $after: String, $before: String) {
  node(id: $id) {
    ... on Block {
      hash
      transactions(first: $first, after: $after, last: $last, before: $before) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
        edges {
          cursor
          node {
            id
            hash
            cmd {
              meta {
                sender
              }
              payload {
                ... on ExecutionPayload {
                  code
                }
              }
            }
            result {
              ... on TransactionResult {
                badResult
                goodResult
                continuation
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useBlockTransactionsQuery__
 *
 * To run a query within a React component, call `useBlockTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockTransactionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useBlockTransactionsQuery(baseOptions: Apollo.QueryHookOptions<BlockTransactionsQuery, BlockTransactionsQueryVariables> & ({ variables: BlockTransactionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlockTransactionsQuery, BlockTransactionsQueryVariables>(BlockTransactionsDocument, options);
      }
export function useBlockTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlockTransactionsQuery, BlockTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlockTransactionsQuery, BlockTransactionsQueryVariables>(BlockTransactionsDocument, options);
        }
export function useBlockTransactionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BlockTransactionsQuery, BlockTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BlockTransactionsQuery, BlockTransactionsQueryVariables>(BlockTransactionsDocument, options);
        }
export type BlockTransactionsQueryHookResult = ReturnType<typeof useBlockTransactionsQuery>;
export type BlockTransactionsLazyQueryHookResult = ReturnType<typeof useBlockTransactionsLazyQuery>;
export type BlockTransactionsSuspenseQueryHookResult = ReturnType<typeof useBlockTransactionsSuspenseQuery>;
export type BlockTransactionsQueryResult = Apollo.QueryResult<BlockTransactionsQuery, BlockTransactionsQueryVariables>;
export const TransactionRequestKeyDocument = gql`
    query transactionRequestKey($requestKey: String!) {
  transaction(requestKey: $requestKey) {
    id
    hash
    sigs {
      sig
    }
    cmd {
      payload {
        __typename
        ... on ExecutionPayload {
          data
          code
        }
        ... on ContinuationPayload {
          data
          pactId
          proof
          rollback
          step
        }
      }
      meta {
        chainId
        gasLimit
        gasPrice
        sender
        ttl
        creationTime
      }
      networkId
      nonce
      signers {
        pubkey
        clist {
          args
          name
        }
        scheme
      }
    }
    result {
      ... on TransactionResult {
        goodResult
        badResult
        transactionId
        logs
        gas
        block {
          height
          hash
          creationTime
        }
        metadata
        continuation
        events {
          edges {
            node {
              qualifiedName
              parameters
            }
          }
        }
        transfers {
          edges {
            node {
              crossChainTransfer {
                requestKey
                senderAccount
                receiverAccount
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useTransactionRequestKeyQuery__
 *
 * To run a query within a React component, call `useTransactionRequestKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionRequestKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionRequestKeyQuery({
 *   variables: {
 *      requestKey: // value for 'requestKey'
 *   },
 * });
 */
export function useTransactionRequestKeyQuery(baseOptions: Apollo.QueryHookOptions<TransactionRequestKeyQuery, TransactionRequestKeyQueryVariables> & ({ variables: TransactionRequestKeyQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionRequestKeyQuery, TransactionRequestKeyQueryVariables>(TransactionRequestKeyDocument, options);
      }
export function useTransactionRequestKeyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionRequestKeyQuery, TransactionRequestKeyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionRequestKeyQuery, TransactionRequestKeyQueryVariables>(TransactionRequestKeyDocument, options);
        }
export function useTransactionRequestKeySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TransactionRequestKeyQuery, TransactionRequestKeyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TransactionRequestKeyQuery, TransactionRequestKeyQueryVariables>(TransactionRequestKeyDocument, options);
        }
export type TransactionRequestKeyQueryHookResult = ReturnType<typeof useTransactionRequestKeyQuery>;
export type TransactionRequestKeyLazyQueryHookResult = ReturnType<typeof useTransactionRequestKeyLazyQuery>;
export type TransactionRequestKeySuspenseQueryHookResult = ReturnType<typeof useTransactionRequestKeySuspenseQuery>;
export type TransactionRequestKeyQueryResult = Apollo.QueryResult<TransactionRequestKeyQuery, TransactionRequestKeyQueryVariables>;
export const AccountDocument = gql`
    query account($accountName: String!) {
  fungibleAccount(accountName: $accountName) {
    ...CoreAccountFields
  }
}
    ${CoreAccountFieldsFragmentDoc}`;

/**
 * __useAccountQuery__
 *
 * To run a query within a React component, call `useAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountQuery({
 *   variables: {
 *      accountName: // value for 'accountName'
 *   },
 * });
 */
export function useAccountQuery(baseOptions: Apollo.QueryHookOptions<AccountQuery, AccountQueryVariables> & ({ variables: AccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
      }
export function useAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountQuery, AccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
        }
export function useAccountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AccountQuery, AccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
        }
export type AccountQueryHookResult = ReturnType<typeof useAccountQuery>;
export type AccountLazyQueryHookResult = ReturnType<typeof useAccountLazyQuery>;
export type AccountSuspenseQueryHookResult = ReturnType<typeof useAccountSuspenseQuery>;
export type AccountQueryResult = Apollo.QueryResult<AccountQuery, AccountQueryVariables>;
export const CoreAccountDocument = gql`
    query coreAccount($accountName: String!) {
  fungibleAccount(accountName: $accountName) {
    ...CoreAccountFields
  }
}
    ${CoreAccountFieldsFragmentDoc}`;

/**
 * __useCoreAccountQuery__
 *
 * To run a query within a React component, call `useCoreAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useCoreAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCoreAccountQuery({
 *   variables: {
 *      accountName: // value for 'accountName'
 *   },
 * });
 */
export function useCoreAccountQuery(baseOptions: Apollo.QueryHookOptions<CoreAccountQuery, CoreAccountQueryVariables> & ({ variables: CoreAccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CoreAccountQuery, CoreAccountQueryVariables>(CoreAccountDocument, options);
      }
export function useCoreAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CoreAccountQuery, CoreAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CoreAccountQuery, CoreAccountQueryVariables>(CoreAccountDocument, options);
        }
export function useCoreAccountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CoreAccountQuery, CoreAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CoreAccountQuery, CoreAccountQueryVariables>(CoreAccountDocument, options);
        }
export type CoreAccountQueryHookResult = ReturnType<typeof useCoreAccountQuery>;
export type CoreAccountLazyQueryHookResult = ReturnType<typeof useCoreAccountLazyQuery>;
export type CoreAccountSuspenseQueryHookResult = ReturnType<typeof useCoreAccountSuspenseQuery>;
export type CoreAccountQueryResult = Apollo.QueryResult<CoreAccountQuery, CoreAccountQueryVariables>;
export const BlocksFromHeightDocument = gql`
    query blocksFromHeight($startHeight: Int!, $endHeight: Int!, $first: Int!) {
  blocksFromHeight(
    startHeight: $startHeight
    endHeight: $endHeight
    first: $first
  ) {
    edges {
      node {
        height
        hash
        chainId
      }
    }
  }
}
    `;

/**
 * __useBlocksFromHeightQuery__
 *
 * To run a query within a React component, call `useBlocksFromHeightQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlocksFromHeightQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlocksFromHeightQuery({
 *   variables: {
 *      startHeight: // value for 'startHeight'
 *      endHeight: // value for 'endHeight'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useBlocksFromHeightQuery(baseOptions: Apollo.QueryHookOptions<BlocksFromHeightQuery, BlocksFromHeightQueryVariables> & ({ variables: BlocksFromHeightQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlocksFromHeightQuery, BlocksFromHeightQueryVariables>(BlocksFromHeightDocument, options);
      }
export function useBlocksFromHeightLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlocksFromHeightQuery, BlocksFromHeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlocksFromHeightQuery, BlocksFromHeightQueryVariables>(BlocksFromHeightDocument, options);
        }
export function useBlocksFromHeightSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BlocksFromHeightQuery, BlocksFromHeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BlocksFromHeightQuery, BlocksFromHeightQueryVariables>(BlocksFromHeightDocument, options);
        }
export type BlocksFromHeightQueryHookResult = ReturnType<typeof useBlocksFromHeightQuery>;
export type BlocksFromHeightLazyQueryHookResult = ReturnType<typeof useBlocksFromHeightLazyQuery>;
export type BlocksFromHeightSuspenseQueryHookResult = ReturnType<typeof useBlocksFromHeightSuspenseQuery>;
export type BlocksFromHeightQueryResult = Apollo.QueryResult<BlocksFromHeightQuery, BlocksFromHeightQueryVariables>;
export const BlockDocument = gql`
    query block($hash: String!) {
  block(hash: $hash) {
    hash
    ...AllBlockFields
    parent {
      hash
    }
    minerAccount {
      accountName
      guard {
        keys
        predicate
      }
    }
    neighbors {
      chainId
      hash
    }
    transactions {
      totalCount
    }
  }
}
    ${AllBlockFieldsFragmentDoc}`;

/**
 * __useBlockQuery__
 *
 * To run a query within a React component, call `useBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockQuery({
 *   variables: {
 *      hash: // value for 'hash'
 *   },
 * });
 */
export function useBlockQuery(baseOptions: Apollo.QueryHookOptions<BlockQuery, BlockQueryVariables> & ({ variables: BlockQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlockQuery, BlockQueryVariables>(BlockDocument, options);
      }
export function useBlockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlockQuery, BlockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlockQuery, BlockQueryVariables>(BlockDocument, options);
        }
export function useBlockSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BlockQuery, BlockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BlockQuery, BlockQueryVariables>(BlockDocument, options);
        }
export type BlockQueryHookResult = ReturnType<typeof useBlockQuery>;
export type BlockLazyQueryHookResult = ReturnType<typeof useBlockLazyQuery>;
export type BlockSuspenseQueryHookResult = ReturnType<typeof useBlockSuspenseQuery>;
export type BlockQueryResult = Apollo.QueryResult<BlockQuery, BlockQueryVariables>;
export const CoreBlocksFromHeightDocument = gql`
    query coreBlocksFromHeight($startHeight: Int!, $endHeight: Int, $chainIds: [String!], $first: Int, $last: Int, $before: String, $after: String) {
  blocksFromHeight(
    startHeight: $startHeight
    endHeight: $endHeight
    chainIds: $chainIds
    first: $first
    last: $last
    before: $before
    after: $after
  ) {
    edges {
      node {
        ...CoreBlockFields
        transactions {
          totalCount
        }
      }
    }
  }
}
    ${CoreBlockFieldsFragmentDoc}`;

/**
 * __useCoreBlocksFromHeightQuery__
 *
 * To run a query within a React component, call `useCoreBlocksFromHeightQuery` and pass it any options that fit your needs.
 * When your component renders, `useCoreBlocksFromHeightQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCoreBlocksFromHeightQuery({
 *   variables: {
 *      startHeight: // value for 'startHeight'
 *      endHeight: // value for 'endHeight'
 *      chainIds: // value for 'chainIds'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useCoreBlocksFromHeightQuery(baseOptions: Apollo.QueryHookOptions<CoreBlocksFromHeightQuery, CoreBlocksFromHeightQueryVariables> & ({ variables: CoreBlocksFromHeightQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CoreBlocksFromHeightQuery, CoreBlocksFromHeightQueryVariables>(CoreBlocksFromHeightDocument, options);
      }
export function useCoreBlocksFromHeightLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CoreBlocksFromHeightQuery, CoreBlocksFromHeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CoreBlocksFromHeightQuery, CoreBlocksFromHeightQueryVariables>(CoreBlocksFromHeightDocument, options);
        }
export function useCoreBlocksFromHeightSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CoreBlocksFromHeightQuery, CoreBlocksFromHeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CoreBlocksFromHeightQuery, CoreBlocksFromHeightQueryVariables>(CoreBlocksFromHeightDocument, options);
        }
export type CoreBlocksFromHeightQueryHookResult = ReturnType<typeof useCoreBlocksFromHeightQuery>;
export type CoreBlocksFromHeightLazyQueryHookResult = ReturnType<typeof useCoreBlocksFromHeightLazyQuery>;
export type CoreBlocksFromHeightSuspenseQueryHookResult = ReturnType<typeof useCoreBlocksFromHeightSuspenseQuery>;
export type CoreBlocksFromHeightQueryResult = Apollo.QueryResult<CoreBlocksFromHeightQuery, CoreBlocksFromHeightQueryVariables>;
export const CompletedBlockHeightsDocument = gql`
    query completedBlockHeights($first: Int, $last: Int, $before: String, $after: String, $chainIds: [String!], $completedHeights: Boolean, $heightCount: Int) {
  completedBlockHeights(
    first: $first
    last: $last
    before: $before
    after: $after
    chainIds: $chainIds
    completedHeights: $completedHeights
    heightCount: $heightCount
  ) {
    edges {
      node {
        ...CoreBlockFields
        transactions {
          totalCount
        }
      }
    }
  }
}
    ${CoreBlockFieldsFragmentDoc}`;

/**
 * __useCompletedBlockHeightsQuery__
 *
 * To run a query within a React component, call `useCompletedBlockHeightsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompletedBlockHeightsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompletedBlockHeightsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      chainIds: // value for 'chainIds'
 *      completedHeights: // value for 'completedHeights'
 *      heightCount: // value for 'heightCount'
 *   },
 * });
 */
export function useCompletedBlockHeightsQuery(baseOptions?: Apollo.QueryHookOptions<CompletedBlockHeightsQuery, CompletedBlockHeightsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompletedBlockHeightsQuery, CompletedBlockHeightsQueryVariables>(CompletedBlockHeightsDocument, options);
      }
export function useCompletedBlockHeightsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompletedBlockHeightsQuery, CompletedBlockHeightsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompletedBlockHeightsQuery, CompletedBlockHeightsQueryVariables>(CompletedBlockHeightsDocument, options);
        }
export function useCompletedBlockHeightsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CompletedBlockHeightsQuery, CompletedBlockHeightsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CompletedBlockHeightsQuery, CompletedBlockHeightsQueryVariables>(CompletedBlockHeightsDocument, options);
        }
export type CompletedBlockHeightsQueryHookResult = ReturnType<typeof useCompletedBlockHeightsQuery>;
export type CompletedBlockHeightsLazyQueryHookResult = ReturnType<typeof useCompletedBlockHeightsLazyQuery>;
export type CompletedBlockHeightsSuspenseQueryHookResult = ReturnType<typeof useCompletedBlockHeightsSuspenseQuery>;
export type CompletedBlockHeightsQueryResult = Apollo.QueryResult<CompletedBlockHeightsQuery, CompletedBlockHeightsQueryVariables>;
export const EventsDocument = gql`
    query events($qualifiedName: String!, $minHeight: Int, $maxHeight: Int) {
  events(
    qualifiedEventName: $qualifiedName
    minHeight: $minHeight
    maxHeight: $maxHeight
  ) {
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
 *      minHeight: // value for 'minHeight'
 *      maxHeight: // value for 'maxHeight'
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
export const LastBlockHeightDocument = gql`
    query lastBlockHeight {
  lastBlockHeight
}
    `;

/**
 * __useLastBlockHeightQuery__
 *
 * To run a query within a React component, call `useLastBlockHeightQuery` and pass it any options that fit your needs.
 * When your component renders, `useLastBlockHeightQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLastBlockHeightQuery({
 *   variables: {
 *   },
 * });
 */
export function useLastBlockHeightQuery(baseOptions?: Apollo.QueryHookOptions<LastBlockHeightQuery, LastBlockHeightQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LastBlockHeightQuery, LastBlockHeightQueryVariables>(LastBlockHeightDocument, options);
      }
export function useLastBlockHeightLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LastBlockHeightQuery, LastBlockHeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LastBlockHeightQuery, LastBlockHeightQueryVariables>(LastBlockHeightDocument, options);
        }
export function useLastBlockHeightSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LastBlockHeightQuery, LastBlockHeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LastBlockHeightQuery, LastBlockHeightQueryVariables>(LastBlockHeightDocument, options);
        }
export type LastBlockHeightQueryHookResult = ReturnType<typeof useLastBlockHeightQuery>;
export type LastBlockHeightLazyQueryHookResult = ReturnType<typeof useLastBlockHeightLazyQuery>;
export type LastBlockHeightSuspenseQueryHookResult = ReturnType<typeof useLastBlockHeightSuspenseQuery>;
export type LastBlockHeightQueryResult = Apollo.QueryResult<LastBlockHeightQuery, LastBlockHeightQueryVariables>;
export const NetworkInfoDocument = gql`
    query networkInfo {
  networkInfo {
    apiVersion
    networkHost
    networkId
    transactionCount
    coinsInCirculation
    networkHashRate
    totalDifficulty
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
export const TransactionsDocument = gql`
    query transactions($fungibleName: String, $accountName: String, $chainId: String, $blockHash: String, $after: String, $before: String, $first: Int, $last: Int) {
  transactions(
    fungibleName: $fungibleName
    accountName: $accountName
    chainId: $chainId
    blockHash: $blockHash
    after: $after
    before: $before
    first: $first
    last: $last
  ) {
    totalCount
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      node {
        ...AllTransactionFields
      }
    }
  }
}
    ${AllTransactionFieldsFragmentDoc}`;

/**
 * __useTransactionsQuery__
 *
 * To run a query within a React component, call `useTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionsQuery({
 *   variables: {
 *      fungibleName: // value for 'fungibleName'
 *      accountName: // value for 'accountName'
 *      chainId: // value for 'chainId'
 *      blockHash: // value for 'blockHash'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useTransactionsQuery(baseOptions?: Apollo.QueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
      }
export function useTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
        }
export function useTransactionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TransactionsQuery, TransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TransactionsQuery, TransactionsQueryVariables>(TransactionsDocument, options);
        }
export type TransactionsQueryHookResult = ReturnType<typeof useTransactionsQuery>;
export type TransactionsLazyQueryHookResult = ReturnType<typeof useTransactionsLazyQuery>;
export type TransactionsSuspenseQueryHookResult = ReturnType<typeof useTransactionsSuspenseQuery>;
export type TransactionsQueryResult = Apollo.QueryResult<TransactionsQuery, TransactionsQueryVariables>;
export const TransactionDocument = gql`
    query transaction($requestKey: String!) {
  transaction(requestKey: $requestKey) {
    ...CoreTransactionFields
  }
}
    ${CoreTransactionFieldsFragmentDoc}`;

/**
 * __useTransactionQuery__
 *
 * To run a query within a React component, call `useTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionQuery({
 *   variables: {
 *      requestKey: // value for 'requestKey'
 *   },
 * });
 */
export function useTransactionQuery(baseOptions: Apollo.QueryHookOptions<TransactionQuery, TransactionQueryVariables> & ({ variables: TransactionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionQuery, TransactionQueryVariables>(TransactionDocument, options);
      }
export function useTransactionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionQuery, TransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionQuery, TransactionQueryVariables>(TransactionDocument, options);
        }
export function useTransactionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TransactionQuery, TransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TransactionQuery, TransactionQueryVariables>(TransactionDocument, options);
        }
export type TransactionQueryHookResult = ReturnType<typeof useTransactionQuery>;
export type TransactionLazyQueryHookResult = ReturnType<typeof useTransactionLazyQuery>;
export type TransactionSuspenseQueryHookResult = ReturnType<typeof useTransactionSuspenseQuery>;
export type TransactionQueryResult = Apollo.QueryResult<TransactionQuery, TransactionQueryVariables>;
export const NewBlocksDocument = gql`
    subscription newBlocks {
  newBlocks {
    ...CoreBlockFields
    transactions {
      totalCount
      edges {
        node {
          ...CoreTransactionFields
        }
      }
    }
  }
}
    ${CoreBlockFieldsFragmentDoc}
${CoreTransactionFieldsFragmentDoc}`;

/**
 * __useNewBlocksSubscription__
 *
 * To run a query within a React component, call `useNewBlocksSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewBlocksSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewBlocksSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewBlocksSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewBlocksSubscription, NewBlocksSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewBlocksSubscription, NewBlocksSubscriptionVariables>(NewBlocksDocument, options);
      }
export type NewBlocksSubscriptionHookResult = ReturnType<typeof useNewBlocksSubscription>;
export type NewBlocksSubscriptionResult = Apollo.SubscriptionResult<NewBlocksSubscription>;