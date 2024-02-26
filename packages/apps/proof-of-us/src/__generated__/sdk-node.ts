import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any };
  /** Floats that will have a value of 0 or more. */
  Decimal: { input: any; output: any };
  /** Floats that will have a value greater than 0. */
  PositiveFloat: { input: any; output: any };
};

/** A unit of information that stores a set of verified transactions. */
export type Block = Node & {
  __typename?: 'Block';
  chainId: Scalars['BigInt']['output'];
  creationTime: Scalars['DateTime']['output'];
  /** The moment the difficulty is adjusted to maintain a block validation time of 30 seconds. */
  epoch: Scalars['DateTime']['output'];
  events: BlockEventsConnection;
  hash: Scalars['ID']['output'];
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  minerAccount: FungibleChainAccount;
  parent?: Maybe<Block>;
  payloadHash: Scalars['String']['output'];
  /** The proof of work hash. */
  powHash: Scalars['String']['output'];
  transactions: BlockTransactionsConnection;
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
  /** The order index of this event, in the case that there are multiple events. */
  orderIndex: Scalars['BigInt']['output'];
  parameterText: Scalars['String']['output'];
  parameters?: Maybe<Scalars['String']['output']>;
  /** The full eventname, containing module and eventname, e.g. coin.TRANSFER */
  qualifiedName: Scalars['String']['output'];
  requestKey: Scalars['String']['output'];
  transaction?: Maybe<Transaction>;
};

/** A fungible-specific account. */
export type FungibleAccount = Node & {
  __typename?: 'FungibleAccount';
  accountName: Scalars['String']['output'];
  chainAccounts: Array<FungibleChainAccount>;
  fungibleName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  totalBalance: Scalars['Decimal']['output'];
  transactions: FungibleAccountTransactionsConnection;
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
  totalCount: Scalars['Int']['output'];
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
  chainId: Scalars['ID']['output'];
  fungibleName: Scalars['String']['output'];
  guard: Guard;
  id: Scalars['ID']['output'];
  transactions: FungibleChainAccountTransactionsConnection;
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
  totalCount: Scalars['Int']['output'];
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

/** Guard for an account. */
export type Guard = {
  __typename?: 'Guard';
  keys: Array<Scalars['String']['output']>;
  predicate: Scalars['String']['output'];
};

/** The account of the miner that solved a block. */
export type MinerKey = Node & {
  __typename?: 'MinerKey';
  block: Block;
  blockHash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
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
  nonFungibles: Array<Token>;
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
  chainId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  nonFungibles: Array<Token>;
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

export type PactQuery = {
  chainId: Scalars['String']['input'];
  code: Scalars['String']['input'];
  data?: InputMaybe<Array<PactQueryData>>;
};

export type PactQueryData = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
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
  /** Retrieve blocks by chain and minimal depth. */
  blocksFromDepth?: Maybe<Array<Block>>;
  /** Retrieve blocks by chain and minimal height. */
  blocksFromHeight: Array<Block>;
  /** Retrieve all completed blocks from a given height. */
  completedBlockHeights: Array<Block>;
  /** Retrieve a single event by its unique key. */
  event?: Maybe<Event>;
  /** Retrieve events. */
  events: QueryEventsConnection;
  /** Retrieve an fungible specific account by its name and fungible, such as coin. */
  fungibleAccount?: Maybe<FungibleAccount>;
  /** Retrieve an account by public key. */
  fungibleAccountByPublicKey?: Maybe<FungibleAccount>;
  /** Retrieve an account by its name and fungible, such as coin, on a specific chain. */
  fungibleChainAccount?: Maybe<FungibleChainAccount>;
  /** Retrieve a chain account by public key. */
  fungibleChainAccountByPublicKey?: Maybe<FungibleChainAccount>;
  /** Estimate the gas limit for a transaction. */
  gasLimitEstimate: GasLimitEstimation;
  /** Estimate the gas limit for a list of transactions. */
  gasLimitEstimates: Array<GasLimitEstimation>;
  /** Get the configuration of the graph. */
  graphConfiguration: GraphConfiguration;
  /** Get the height of the block with the highest height. */
  lastBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  /** Retrieve a non-fungible specific account by its name. */
  nonFungibleAccount?: Maybe<NonFungibleAccount>;
  /** Retrieve an account by its name on a specific chain. */
  nonFungibleChainAccount?: Maybe<NonFungibleChainAccount>;
  /** Execute arbitrary Pact code via a local call without gas-estimation or signature-verification (e.g. (+ 1 2) or (coin.get-details <account>)). */
  pactQueries: Array<Scalars['String']['output']>;
  /** Execute arbitrary Pact code via a local call without gas-estimation or signature-verification (e.g. (+ 1 2) or (coin.get-details <account>)). */
  pactQuery: Scalars['String']['output'];
  /** Retrieve one transaction by its unique key. */
  transaction?: Maybe<Transaction>;
  /** Retrieve transactions. */
  transactions: QueryTransactionsConnection;
  /** Retrieve all transactions by a given public key. */
  transactionsByPublicKey: QueryTransactionsByPublicKeyConnection;
  /** Retrieve one transfer by its unique key. */
  transfer?: Maybe<Transfer>;
  /** Retrieve transfers. */
  transfers: QueryTransfersConnection;
};

export type QueryBlockArgs = {
  hash: Scalars['String']['input'];
};

export type QueryBlocksFromDepthArgs = {
  chainIds: Array<Scalars['String']['input']>;
  minimumDepth: Scalars['Int']['input'];
};

export type QueryBlocksFromHeightArgs = {
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  startHeight: Scalars['Int']['input'];
};

export type QueryCompletedBlockHeightsArgs = {
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  completedHeights?: InputMaybe<Scalars['Boolean']['input']>;
  heightCount?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryEventArgs = {
  blockHash: Scalars['String']['input'];
  orderIndex: Scalars['Int']['input'];
  requestKey: Scalars['String']['input'];
};

export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  parametersFilter?: InputMaybe<Scalars['String']['input']>;
  qualifiedEventName: Scalars['String']['input'];
};

export type QueryFungibleAccountArgs = {
  accountName: Scalars['String']['input'];
  fungibleName: Scalars['String']['input'];
};

export type QueryFungibleAccountByPublicKeyArgs = {
  publicKey: Scalars['String']['input'];
};

export type QueryFungibleChainAccountArgs = {
  accountName: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  fungibleName: Scalars['String']['input'];
};

export type QueryFungibleChainAccountByPublicKeyArgs = {
  chainId: Scalars['String']['input'];
  publicKey: Scalars['String']['input'];
};

export type QueryGasLimitEstimateArgs = {
  input: Scalars['String']['input'];
};

export type QueryGasLimitEstimatesArgs = {
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

export type QueryPactQueriesArgs = {
  pactQuery: Array<PactQuery>;
};

export type QueryPactQueryArgs = {
  pactQuery: PactQuery;
};

export type QueryTransactionArgs = {
  blockHash: Scalars['String']['input'];
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
  requestKey?: InputMaybe<Scalars['String']['input']>;
};

export type QueryTransactionsByPublicKeyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  publicKey: Scalars['String']['input'];
};

export type QueryTransferArgs = {
  blockHash: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  moduleHash: Scalars['String']['input'];
  orderIndex: Scalars['Int']['input'];
  requestKey: Scalars['String']['input'];
};

export type QueryTransfersArgs = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
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
  edges: Array<QueryTransactionsByPublicKeyConnectionEdge>;
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
  capabilities?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  orderIndex: Scalars['Int']['output'];
  publicKey: Scalars['String']['output'];
  requestKey: Scalars['String']['output'];
  /** The signature scheme that was used to sign. */
  scheme?: Maybe<Scalars['String']['output']>;
  /** The result of the signing operation of the hash of the transaction. */
  signature: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Listen for events by qualifiedName (e.g. `coin.TRANSFER`). */
  events?: Maybe<Array<Event>>;
  /** Subscribe to new blocks. */
  newBlocks?: Maybe<Array<Block>>;
  /** Subscribe to new blocks from a specific depth. */
  newBlocksFromDepth?: Maybe<Array<Block>>;
  /** Listen for a transaction by request key. Returns the ID when it is in a block. */
  transaction?: Maybe<Transaction>;
};

export type SubscriptionEventsArgs = {
  chainId?: InputMaybe<Scalars['String']['input']>;
  parametersFilter?: InputMaybe<Scalars['String']['input']>;
  qualifiedEventName: Scalars['String']['input'];
};

export type SubscriptionNewBlocksArgs = {
  chainIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type SubscriptionNewBlocksFromDepthArgs = {
  chainIds: Array<Scalars['String']['input']>;
  minimumDepth: Scalars['Int']['input'];
};

export type SubscriptionTransactionArgs = {
  requestKey: Scalars['String']['input'];
};

/** The token identifier and its balance. */
export type Token = {
  __typename?: 'Token';
  balance: Scalars['Int']['output'];
  chainId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  info?: Maybe<TokenInfo>;
  version: Scalars['String']['output'];
};

/** Information related to a token. */
export type TokenInfo = {
  __typename?: 'TokenInfo';
  precision: Scalars['Int']['output'];
  supply: Scalars['Int']['output'];
  uri: Scalars['String']['output'];
};

/** A confirmed transaction. */
export type Transaction = Node & {
  __typename?: 'Transaction';
  /** The JSON stringified error message if the transaction failed. */
  badResult?: Maybe<Scalars['String']['output']>;
  block?: Maybe<Block>;
  chainId: Scalars['BigInt']['output'];
  /** The Pact expressions executed in this transaction when it is an `exec` transaction. For a continuation, this field is `cont`. */
  code: Scalars['String']['output'];
  /** The JSON stringified continuation in the case that it is a continuation. */
  continuation?: Maybe<Scalars['String']['output']>;
  creationTime: Scalars['DateTime']['output'];
  /** The environment data made available to the transaction. Formatted as raw JSON. */
  data?: Maybe<Scalars['String']['output']>;
  eventCount?: Maybe<Scalars['BigInt']['output']>;
  events?: Maybe<Array<Event>>;
  gas: Scalars['BigInt']['output'];
  gasLimit: Scalars['BigInt']['output'];
  gasPrice: Scalars['Float']['output'];
  /** The transaction result when it was successful. Formatted as raw JSON. */
  goodResult?: Maybe<Scalars['String']['output']>;
  /** The height of the block this transaction belongs to. */
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  /** Identifier to retrieve the logs for the execution of the transaction. */
  logs?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['String']['output']>;
  nonce?: Maybe<Scalars['String']['output']>;
  /** In the case of a cross-chain transaction; A unique id when a pact (defpact) is initiated. See the "Pact execution scope and pact-id" explanation in the docs for more information. */
  pactId?: Maybe<Scalars['String']['output']>;
  /** In the case of a cross-chain transaction; the proof provided to continue the cross-chain transaction. */
  proof?: Maybe<Scalars['String']['output']>;
  requestKey: Scalars['String']['output'];
  /** In the case of a cross-chain transaction; Whether or not this transaction can be rolled back. */
  rollback?: Maybe<Scalars['Boolean']['output']>;
  senderAccount?: Maybe<Scalars['String']['output']>;
  signers?: Maybe<Array<Signer>>;
  /** The step-number when this is an execution of a `defpact`, aka multi-step transaction. */
  step?: Maybe<Scalars['BigInt']['output']>;
  transactionId?: Maybe<Scalars['BigInt']['output']>;
  transfers?: Maybe<Array<Transfer>>;
  ttl: Scalars['BigInt']['output'];
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

export type GetTokensQueryVariables = Exact<{
  accountName: Scalars['String']['input'];
}>;

export type GetTokensQuery = {
  __typename?: 'Query';
  nonFungibleAccount?: {
    __typename?: 'NonFungibleAccount';
    accountName: string;
    id: string;
    nonFungibles: Array<{
      __typename?: 'Token';
      balance: number;
      id: string;
      info?: { __typename?: 'TokenInfo'; uri: string } | null;
    }>;
  } | null;
};

export const GetTokensDocument = gql`
  query GetTokens($accountName: String!) {
    nonFungibleAccount(accountName: $accountName) {
      accountName
      id
      nonFungibles {
        balance
        id
        info {
          uri
        }
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    GetTokens(
      variables: GetTokensQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetTokensQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetTokensQuery>(GetTokensDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'GetTokens',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
