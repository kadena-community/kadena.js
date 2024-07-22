import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const accountTransactions: DocumentNode = gql`
  query accountTransactions(
    $id: ID!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    node(id: $id) {
      ... on FungibleAccount {
        transactions(
          first: $first
          after: $after
          last: $last
          before: $before
        ) {
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
