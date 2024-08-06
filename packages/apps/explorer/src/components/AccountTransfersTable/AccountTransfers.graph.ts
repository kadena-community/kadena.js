import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const accountTransfers: DocumentNode = gql`
  query accountTransfers(
    $id: ID!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    node(id: $id) {
      ... on FungibleAccount {
        transfers(first: $first, after: $after, last: $last, before: $before) {
          totalCount
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
