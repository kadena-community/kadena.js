/* eslint-disable */
import * as types from './graphql.js';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  query accountTransfers($accountName: String!, $fungibleName: String) {\n    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {\n      transfers(first: 100) {\n        edges {\n          node {\n            amount\n            block {\n              hash\n              creationTime\n            }\n            chainId\n            crossChainTransfer {\n              receiverAccount\n              senderAccount\n              chainId\n              requestKey\n              transaction {\n                result {\n                  __typename\n                  ... on TransactionResult {\n                    goodResult\n                    badResult\n                  }\n                }\n              }\n            }\n            transaction {\n              cmd {\n                networkId\n                signers {\n                  clist {\n                    name\n                    args\n                  }\n                }\n              }\n              result {\n                __typename\n                ... on TransactionResult {\n                  events {\n                    edges {\n                      node {\n                        name\n                        parameters\n                      }\n                    }\n                  }\n                  goodResult\n                  badResult\n                }\n              }\n            }\n            senderAccount\n            height\n            orderIndex\n            requestKey\n            receiverAccount\n          }\n        }\n      }\n    }\n  }\n": types.AccountTransfersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query accountTransfers($accountName: String!, $fungibleName: String) {\n    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {\n      transfers(first: 100) {\n        edges {\n          node {\n            amount\n            block {\n              hash\n              creationTime\n            }\n            chainId\n            crossChainTransfer {\n              receiverAccount\n              senderAccount\n              chainId\n              requestKey\n              transaction {\n                result {\n                  __typename\n                  ... on TransactionResult {\n                    goodResult\n                    badResult\n                  }\n                }\n              }\n            }\n            transaction {\n              cmd {\n                networkId\n                signers {\n                  clist {\n                    name\n                    args\n                  }\n                }\n              }\n              result {\n                __typename\n                ... on TransactionResult {\n                  events {\n                    edges {\n                      node {\n                        name\n                        parameters\n                      }\n                    }\n                  }\n                  goodResult\n                  badResult\n                }\n              }\n            }\n            senderAccount\n            height\n            orderIndex\n            requestKey\n            receiverAccount\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query accountTransfers($accountName: String!, $fungibleName: String) {\n    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {\n      transfers(first: 100) {\n        edges {\n          node {\n            amount\n            block {\n              hash\n              creationTime\n            }\n            chainId\n            crossChainTransfer {\n              receiverAccount\n              senderAccount\n              chainId\n              requestKey\n              transaction {\n                result {\n                  __typename\n                  ... on TransactionResult {\n                    goodResult\n                    badResult\n                  }\n                }\n              }\n            }\n            transaction {\n              cmd {\n                networkId\n                signers {\n                  clist {\n                    name\n                    args\n                  }\n                }\n              }\n              result {\n                __typename\n                ... on TransactionResult {\n                  events {\n                    edges {\n                      node {\n                        name\n                        parameters\n                      }\n                    }\n                  }\n                  goodResult\n                  badResult\n                }\n              }\n            }\n            senderAccount\n            height\n            orderIndex\n            requestKey\n            receiverAccount\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;