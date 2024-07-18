import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import {
  ALL_TRANSACTION_FIELDS,
  CORE_TRANSACTION_FIELDS,
} from '../fragments/transactions.graph';

export const transactions: DocumentNode = gql`
  ${ALL_TRANSACTION_FIELDS}

  query transactions(
    $fungibleName: String
    $accountName: String
    $chainId: String
    $blockHash: String
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
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
`;

export const coreTransaction: DocumentNode = gql`
  ${CORE_TRANSACTION_FIELDS}

  query transaction($requestKey: String!) {
    transaction(requestKey: $requestKey) {
      ...CoreTransactionFields
    }
  }
`;
