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
    "\n  query accountsByPublicKey($publicKey: String!, $fungibleName: String) {\n    fungibleAccountsByPublicKey(\n      publicKey: $publicKey\n      fungibleName: $fungibleName\n    ) {\n      accountName\n      chainAccounts {\n        accountName\n        chainId\n      }\n    }\n  }\n": types.AccountsByPublicKeyDocument,
    "\n  fragment TransferFields on Transfer {\n    amount\n    chainId\n    orderIndex\n    receiverAccount\n    requestKey\n    senderAccount\n    moduleName\n    block {\n      hash\n      height\n      creationTime\n      minerAccount {\n        accountName\n      }\n    }\n    transaction {\n      cmd {\n        networkId\n        meta {\n          gasPrice\n          sender\n        }\n        payload {\n          __typename\n          ... on ExecutionPayload {\n            code\n            data\n          }\n          ... on ContinuationPayload {\n            step\n            pactId\n          }\n        }\n        signers {\n          clist {\n            name\n            args\n          }\n        }\n      }\n      result {\n        __typename\n        ... on TransactionResult {\n          goodResult\n          badResult\n          gas\n          events {\n            edges {\n              node {\n                name\n                parameters\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.TransferFieldsFragmentDoc,
    "\n  query accountTransfers(\n    $accountName: String!\n    $fungibleName: String\n    $first: Int\n    $last: Int\n    $before: String\n    $after: String\n  ) {\n    lastBlockHeight\n    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {\n      transfers(first: $first, last: $last, before: $before, after: $after) {\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          node {\n            ...TransferFields\n            crossChainTransfer {\n              ...TransferFields\n            }\n          }\n        }\n      }\n    }\n  }\n": types.AccountTransfersDocument,
    "\n  query accountChainTransfers(\n    $accountName: String!\n    $chainId: String\n    $fungibleName: String\n    $first: Int\n    $last: Int\n    $before: String\n    $after: String\n  ) {\n    lastBlockHeight\n    transfers(\n      accountName: $accountName\n      chainId: $chainId\n      fungibleName: $fungibleName\n      first: $first\n      last: $last\n      before: $before\n      after: $after\n    ) {\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        node {\n          ...TransferFields\n          crossChainTransfer {\n            ...TransferFields\n          }\n        }\n      }\n    }\n  }\n": types.AccountChainTransfersDocument,
    "\n  query accountTransferRequestKey($requestKey: String!, $accountName: String) {\n    lastBlockHeight\n    transfers(requestKey: $requestKey, accountName: $accountName) {\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        node {\n          ...TransferFields\n        }\n      }\n    }\n  }\n": types.AccountTransferRequestKeyDocument,
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
export function graphql(source: "\n  query accountsByPublicKey($publicKey: String!, $fungibleName: String) {\n    fungibleAccountsByPublicKey(\n      publicKey: $publicKey\n      fungibleName: $fungibleName\n    ) {\n      accountName\n      chainAccounts {\n        accountName\n        chainId\n      }\n    }\n  }\n"): (typeof documents)["\n  query accountsByPublicKey($publicKey: String!, $fungibleName: String) {\n    fungibleAccountsByPublicKey(\n      publicKey: $publicKey\n      fungibleName: $fungibleName\n    ) {\n      accountName\n      chainAccounts {\n        accountName\n        chainId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TransferFields on Transfer {\n    amount\n    chainId\n    orderIndex\n    receiverAccount\n    requestKey\n    senderAccount\n    moduleName\n    block {\n      hash\n      height\n      creationTime\n      minerAccount {\n        accountName\n      }\n    }\n    transaction {\n      cmd {\n        networkId\n        meta {\n          gasPrice\n          sender\n        }\n        payload {\n          __typename\n          ... on ExecutionPayload {\n            code\n            data\n          }\n          ... on ContinuationPayload {\n            step\n            pactId\n          }\n        }\n        signers {\n          clist {\n            name\n            args\n          }\n        }\n      }\n      result {\n        __typename\n        ... on TransactionResult {\n          goodResult\n          badResult\n          gas\n          events {\n            edges {\n              node {\n                name\n                parameters\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment TransferFields on Transfer {\n    amount\n    chainId\n    orderIndex\n    receiverAccount\n    requestKey\n    senderAccount\n    moduleName\n    block {\n      hash\n      height\n      creationTime\n      minerAccount {\n        accountName\n      }\n    }\n    transaction {\n      cmd {\n        networkId\n        meta {\n          gasPrice\n          sender\n        }\n        payload {\n          __typename\n          ... on ExecutionPayload {\n            code\n            data\n          }\n          ... on ContinuationPayload {\n            step\n            pactId\n          }\n        }\n        signers {\n          clist {\n            name\n            args\n          }\n        }\n      }\n      result {\n        __typename\n        ... on TransactionResult {\n          goodResult\n          badResult\n          gas\n          events {\n            edges {\n              node {\n                name\n                parameters\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query accountTransfers(\n    $accountName: String!\n    $fungibleName: String\n    $first: Int\n    $last: Int\n    $before: String\n    $after: String\n  ) {\n    lastBlockHeight\n    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {\n      transfers(first: $first, last: $last, before: $before, after: $after) {\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          node {\n            ...TransferFields\n            crossChainTransfer {\n              ...TransferFields\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query accountTransfers(\n    $accountName: String!\n    $fungibleName: String\n    $first: Int\n    $last: Int\n    $before: String\n    $after: String\n  ) {\n    lastBlockHeight\n    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {\n      transfers(first: $first, last: $last, before: $before, after: $after) {\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n        edges {\n          node {\n            ...TransferFields\n            crossChainTransfer {\n              ...TransferFields\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query accountChainTransfers(\n    $accountName: String!\n    $chainId: String\n    $fungibleName: String\n    $first: Int\n    $last: Int\n    $before: String\n    $after: String\n  ) {\n    lastBlockHeight\n    transfers(\n      accountName: $accountName\n      chainId: $chainId\n      fungibleName: $fungibleName\n      first: $first\n      last: $last\n      before: $before\n      after: $after\n    ) {\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        node {\n          ...TransferFields\n          crossChainTransfer {\n            ...TransferFields\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query accountChainTransfers(\n    $accountName: String!\n    $chainId: String\n    $fungibleName: String\n    $first: Int\n    $last: Int\n    $before: String\n    $after: String\n  ) {\n    lastBlockHeight\n    transfers(\n      accountName: $accountName\n      chainId: $chainId\n      fungibleName: $fungibleName\n      first: $first\n      last: $last\n      before: $before\n      after: $after\n    ) {\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        node {\n          ...TransferFields\n          crossChainTransfer {\n            ...TransferFields\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query accountTransferRequestKey($requestKey: String!, $accountName: String) {\n    lastBlockHeight\n    transfers(requestKey: $requestKey, accountName: $accountName) {\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        node {\n          ...TransferFields\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query accountTransferRequestKey($requestKey: String!, $accountName: String) {\n    lastBlockHeight\n    transfers(requestKey: $requestKey, accountName: $accountName) {\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n      edges {\n        node {\n          ...TransferFields\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;