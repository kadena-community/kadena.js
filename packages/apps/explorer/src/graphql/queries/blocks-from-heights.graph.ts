import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const coreBlocksFromHeights: DocumentNode = gql`
  query blocksFromHeights(
    $startHeight: Int!
    $endHeight: Int
    $chainIds: [String!]
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    blocksFromHeight(
      startHeight: $startHeight
      endHeight: $endHeight
      chainIds: $chainIds
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      edges {
        node {
          ...CoreBlockFields
          transactions {
            totalCount
          }
        }
      }
    }
  }
`;
