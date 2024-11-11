/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** Floats that will have a value of 0 or more. */
  Decimal: { input: any; output: any; }
  /** Floats that will have a value greater than 0. */
  PositiveFloat: { input: any; output: any; }
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

export type AccountTransfersQueryVariables = Exact<{
  accountName: Scalars['String']['input'];
  fungibleName?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountTransfersQuery = { __typename?: 'Query', fungibleAccount?: { __typename?: 'FungibleAccount', transfers: { __typename?: 'FungibleAccountTransfersConnection', edges: Array<{ __typename?: 'FungibleAccountTransfersConnectionEdge', node: { __typename?: 'Transfer', amount: any, chainId: any, senderAccount: string, height: any, orderIndex: any, requestKey: string, receiverAccount: string, block: { __typename?: 'Block', hash: string, creationTime: any }, crossChainTransfer?: { __typename?: 'Transfer', receiverAccount: string, senderAccount: string, chainId: any, requestKey: string, transaction?: { __typename?: 'Transaction', result: { __typename: 'TransactionMempoolInfo' } | { __typename: 'TransactionResult', goodResult?: string | null, badResult?: string | null } } | null } | null, transaction?: { __typename?: 'Transaction', cmd: { __typename?: 'TransactionCommand', networkId: string, signers: Array<{ __typename?: 'Signer', clist: Array<{ __typename?: 'TransactionCapability', name: string, args: string }> }> }, result: { __typename: 'TransactionMempoolInfo' } | { __typename: 'TransactionResult', goodResult?: string | null, badResult?: string | null, events: { __typename?: 'TransactionResultEventsConnection', edges: Array<{ __typename?: 'TransactionResultEventsConnectionEdge', node: { __typename?: 'Event', name: string, parameters?: string | null } } | null> } } } | null } }> } } | null };


export const AccountTransfersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"accountTransfers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fungibleName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fungibleAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountName"}}},{"kind":"Argument","name":{"kind":"Name","value":"fungibleName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fungibleName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transfers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"creationTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"crossChainTransfer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"receiverAccount"}},{"kind":"Field","name":{"kind":"Name","value":"senderAccount"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"requestKey"}},{"kind":"Field","name":{"kind":"Name","value":"transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goodResult"}},{"kind":"Field","name":{"kind":"Name","value":"badResult"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cmd"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"networkId"}},{"kind":"Field","name":{"kind":"Name","value":"signers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parameters"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"goodResult"}},{"kind":"Field","name":{"kind":"Name","value":"badResult"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"senderAccount"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"orderIndex"}},{"kind":"Field","name":{"kind":"Name","value":"requestKey"}},{"kind":"Field","name":{"kind":"Name","value":"receiverAccount"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AccountTransfersQuery, AccountTransfersQueryVariables>;