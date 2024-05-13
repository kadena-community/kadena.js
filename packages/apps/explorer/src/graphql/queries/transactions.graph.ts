import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const transactions: DocumentNode = gql`
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
