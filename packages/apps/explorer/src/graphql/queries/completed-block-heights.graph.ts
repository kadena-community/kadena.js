import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { CORE_BLOCK_FIELDS } from '../fragments/block.graph';

export const completedBlockHeights: DocumentNode = gql`
  ${CORE_BLOCK_FIELDS}

  query completedBlockHeights(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $chainIds: [String!]
    $completedHeights: Boolean
    $heightCount: Int
  ) {
    completedBlockHeights(
      first: $first
      last: $last
      before: $before
      after: $after
      chainIds: $chainIds
      completedHeights: $completedHeights
      heightCount: $heightCount
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
