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
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
          edges {
            node {
              transaction {
                cmd {
                  meta {
                    chainId
                  }
                }
                hash
              }
              block {
                hash
                height
              }
              amount
              receiverAccount
              senderAccount
            }
          }
        }
      }
    }
  }
`;
