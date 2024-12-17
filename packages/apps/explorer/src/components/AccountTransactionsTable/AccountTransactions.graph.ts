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
                payload {
                  ... on ExecutionPayload {
                    code
                  }
                }
              }
              result {
                ... on TransactionResult {
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
