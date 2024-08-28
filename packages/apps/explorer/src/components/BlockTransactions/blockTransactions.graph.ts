import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const blockTransactions: DocumentNode = gql`
  query blockTransactions(
    $id: ID!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    node(id: $id) {
      ... on Block {
        hash
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
          totalCount
          edges {
            cursor
            node {
              id
              hash
              cmd {
                meta {
                  sender
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
                  continuation
                }
              }
            }
          }
        }
      }
    }
  }
`;
