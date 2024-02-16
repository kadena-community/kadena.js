import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';
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
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
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
}

/** A unit of information that stores a set of verified transactions. */
export type Block = Node & {
  __typename?: 'Block';
  chainId: Scalars['BigInt']['output'];
  /** The number of blocks that proceed this block. */
  confirmationDepth: Scalars['Int']['output'];
  creationTime: Scalars['DateTime']['output'];
  /** The moment the difficulty is adjusted to maintain a block validation time of 30 seconds. */
  epoch: Scalars['DateTime']['output'];
  hash: Scalars['ID']['output'];
  height: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  minerAccount: FungibleChainAccount;
  parent?: Maybe<Block>;
  parentHash: Scalars['String']['output'];
  payloadHash: Scalars['String']['output'];
  /** The proof of work hash. */
  powHash: Scalars['String']['output'];
  predicate: Scalars['String']['output'];
  transactions: BlockTransactionsConnection;
};

/** A unit of information that stores a set of verified transactions. */
export interface BlockTransactionsArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}

export interface BlockTransactionsConnection {
  __typename?: 'BlockTransactionsConnection';
  edges: Array<BlockTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface BlockTransactionsConnectionEdge {
  __typename?: 'BlockTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
}

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
export interface FungibleAccountTransactionsArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}

/** A fungible-specific account. */
export interface FungibleAccountTransfersArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}

export interface FungibleAccountTransactionsConnection {
  __typename?: 'FungibleAccountTransactionsConnection';
  edges: Array<FungibleAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface FungibleAccountTransactionsConnectionEdge {
  __typename?: 'FungibleAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
}

export interface FungibleAccountTransfersConnection {
  __typename?: 'FungibleAccountTransfersConnection';
  edges: Array<FungibleAccountTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface FungibleAccountTransfersConnectionEdge {
  __typename?: 'FungibleAccountTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
}

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
export interface FungibleChainAccountTransactionsArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}

/** A fungible specific chain-account. */
export interface FungibleChainAccountTransfersArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}

export interface FungibleChainAccountTransactionsConnection {
  __typename?: 'FungibleChainAccountTransactionsConnection';
  edges: Array<FungibleChainAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface FungibleChainAccountTransactionsConnectionEdge {
  __typename?: 'FungibleChainAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
}

export interface FungibleChainAccountTransfersConnection {
  __typename?: 'FungibleChainAccountTransfersConnection';
  edges: Array<FungibleChainAccountTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface FungibleChainAccountTransfersConnectionEdge {
  __typename?: 'FungibleChainAccountTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
}

/** General information about the graph and chainweb-data. */
export interface GraphConfiguration {
  __typename?: 'GraphConfiguration';
  /** The maximum number of confirmations calculated on this endpoint. */
  maximumConfirmationDepth: Scalars['Int']['output'];
  /** The lowest block-height that is indexed in this endpoint. */
  minimumBlockHeight?: Maybe<Scalars['BigInt']['output']>;
}

/** Guard for an account. */
export interface Guard {
  __typename?: 'Guard';
  keys: Array<Scalars['String']['output']>;
  predicate: Scalars['String']['output'];
}

/** The account of the miner that solved a block. */
export type MinerKey = Node & {
  __typename?: 'MinerKey';
  block: Block;
  blockHash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
};

export interface Node {
  id: Scalars['ID']['output'];
}

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
export interface NonFungibleAccountTransactionsArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}

export interface NonFungibleAccountTransactionsConnection {
  __typename?: 'NonFungibleAccountTransactionsConnection';
  edges: Array<NonFungibleAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface NonFungibleAccountTransactionsConnectionEdge {
  __typename?: 'NonFungibleAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
}

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
export interface NonFungibleChainAccountTransactionsArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}

export interface NonFungibleChainAccountTransactionsConnection {
  __typename?: 'NonFungibleChainAccountTransactionsConnection';
  edges: Array<NonFungibleChainAccountTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface NonFungibleChainAccountTransactionsConnectionEdge {
  __typename?: 'NonFungibleChainAccountTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
}

export interface PactQuery {
  chainId: Scalars['String']['input'];
  code: Scalars['String']['input'];
  data?: InputMaybe<Array<PactQueryData>>;
}

export interface PactQueryData {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
}

export interface PactTransaction {
  cmd: Scalars['String']['input'];
  hash?: InputMaybe<Scalars['String']['input']>;
  sigs?: InputMaybe<Array<Scalars['String']['input']>>;
}

export interface PageInfo {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
}

export interface Query {
  __typename?: 'Query';
  /** Retrieve a block by hash. */
  block?: Maybe<Block>;
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
  /** Retrieve an account by its name and fungible, such as coin, on a specific chain. */
  fungibleChainAccount?: Maybe<FungibleChainAccount>;
  /** Estimate the gas limit for a transaction. */
  gasLimitEstimate: Scalars['Int']['output'];
  /** Estimate the gas limit for a list of transactions. */
  gasLimitEstimates: Array<Scalars['Int']['output']>;
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
}

export interface QueryBlockArgs {
  hash: Scalars['String']['input'];
}

export interface QueryBlocksFromHeightArgs {
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  startHeight: Scalars['Int']['input'];
}

export interface QueryCompletedBlockHeightsArgs {
  chainIds?: InputMaybe<Array<Scalars['String']['input']>>;
  completedHeights?: InputMaybe<Scalars['Boolean']['input']>;
  heightCount?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryEventArgs {
  blockHash: Scalars['String']['input'];
  orderIndex: Scalars['Int']['input'];
  requestKey: Scalars['String']['input'];
}

export interface QueryEventsArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  qualifiedEventName: Scalars['String']['input'];
}

export interface QueryFungibleAccountArgs {
  accountName: Scalars['String']['input'];
  fungibleName: Scalars['String']['input'];
}

export interface QueryFungibleChainAccountArgs {
  accountName: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  fungibleName: Scalars['String']['input'];
}

export interface QueryGasLimitEstimateArgs {
  transaction: PactTransaction;
}

export interface QueryGasLimitEstimatesArgs {
  transactions: Array<PactTransaction>;
}

export interface QueryNodeArgs {
  id: Scalars['ID']['input'];
}

export interface QueryNodesArgs {
  ids: Array<Scalars['ID']['input']>;
}

export interface QueryNonFungibleAccountArgs {
  accountName: Scalars['String']['input'];
}

export interface QueryNonFungibleChainAccountArgs {
  accountName: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
}

export interface QueryPactQueriesArgs {
  pactQuery: Array<PactQuery>;
}

export interface QueryPactQueryArgs {
  pactQuery: PactQuery;
}

export interface QueryTransactionArgs {
  blockHash: Scalars['String']['input'];
  requestKey: Scalars['String']['input'];
}

export interface QueryTransactionsArgs {
  accountName?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  blockHash?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  requestKey?: InputMaybe<Scalars['String']['input']>;
}

export interface QueryTransactionsByPublicKeyArgs {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  publicKey: Scalars['String']['input'];
}

export interface QueryTransferArgs {
  blockHash: Scalars['String']['input'];
  chainId: Scalars['String']['input'];
  moduleHash: Scalars['String']['input'];
  orderIndex: Scalars['Int']['input'];
  requestKey: Scalars['String']['input'];
}

export interface QueryTransfersArgs {
  accountName?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fungibleName?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryEventsConnection {
  __typename?: 'QueryEventsConnection';
  edges: Array<QueryEventsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface QueryEventsConnectionEdge {
  __typename?: 'QueryEventsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Event;
}

export interface QueryTransactionsByPublicKeyConnection {
  __typename?: 'QueryTransactionsByPublicKeyConnection';
  edges: Array<QueryTransactionsByPublicKeyConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface QueryTransactionsByPublicKeyConnectionEdge {
  __typename?: 'QueryTransactionsByPublicKeyConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
}

export interface QueryTransactionsConnection {
  __typename?: 'QueryTransactionsConnection';
  edges: Array<QueryTransactionsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface QueryTransactionsConnectionEdge {
  __typename?: 'QueryTransactionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
}

export interface QueryTransfersConnection {
  __typename?: 'QueryTransfersConnection';
  edges: Array<QueryTransfersConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
}

export interface QueryTransfersConnectionEdge {
  __typename?: 'QueryTransfersConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
}

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

export interface Subscription {
  __typename?: 'Subscription';
  /** Listen for events by qualifiedName (e.g. `coin.TRANSFER`). */
  events?: Maybe<Array<Scalars['ID']['output']>>;
  /** Subscribe to new blocks. */
  newBlocks?: Maybe<Array<Scalars['ID']['output']>>;
  /** Listen for a transaction by request key. Returns the ID when it is in a block. */
  transaction?: Maybe<Scalars['ID']['output']>;
}

export interface SubscriptionEventsArgs {
  qualifiedEventName: Scalars['String']['input'];
}

export interface SubscriptionNewBlocksArgs {
  chainIds?: InputMaybe<Array<Scalars['Int']['input']>>;
}

export interface SubscriptionTransactionArgs {
  requestKey: Scalars['String']['input'];
}

/** The token identifier and its balance. */
export interface Token {
  __typename?: 'Token';
  balance: Scalars['Int']['output'];
  chainId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  info?: Maybe<TokenInfo>;
  version: Scalars['String']['output'];
}

/** Information related to a token. */
export interface TokenInfo {
  __typename?: 'TokenInfo';
  precision: Scalars['Int']['output'];
  supply: Scalars['Int']['output'];
  uri: Scalars['String']['output'];
}

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

export interface GetTokensQuery {
  __typename?: 'Query';
  nonFungibleAccount?: {
    __typename?: 'NonFungibleAccount';
    accountName: string;
    id: string;
    nonFungibles: Array<{ __typename?: 'Token'; balance: number; id: string }>;
  } | null;
}

export const GetTokensDocument = gql`
  query GetTokens($accountName: String!) {
    nonFungibleAccount(accountName: $accountName) {
      accountName
      id
      nonFungibles {
        balance
        id
      }
    }
  }
`;

/**
 * __useGetTokensQuery__
 *
 * To run a query within a React component, call `useGetTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokensQuery({
 *   variables: {
 *      accountName: // value for 'accountName'
 *   },
 * });
 */
export function useGetTokensQuery(
  baseOptions: Apollo.QueryHookOptions<GetTokensQuery, GetTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTokensQuery, GetTokensQueryVariables>(
    GetTokensDocument,
    options,
  );
}
export function useGetTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTokensQuery,
    GetTokensQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTokensQuery, GetTokensQueryVariables>(
    GetTokensDocument,
    options,
  );
}
export function useGetTokensSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTokensQuery,
    GetTokensQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTokensQuery, GetTokensQueryVariables>(
    GetTokensDocument,
    options,
  );
}
export type GetTokensQueryHookResult = ReturnType<typeof useGetTokensQuery>;
export type GetTokensLazyQueryHookResult = ReturnType<
  typeof useGetTokensLazyQuery
>;
export type GetTokensSuspenseQueryHookResult = ReturnType<
  typeof useGetTokensSuspenseQuery
>;
export type GetTokensQueryResult = Apollo.QueryResult<
  GetTokensQuery,
  GetTokensQueryVariables
>;
