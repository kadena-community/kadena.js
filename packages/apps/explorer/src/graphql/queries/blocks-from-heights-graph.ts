import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const coreBlocksFromHeights: DocumentNode = gql`
  query blocksFromHeights($height: Int!) {
    blocksFromHeight(startHeight: $height) {
      edges {
        node {
          ...CoreBlockFields
        }
      }
    }
  }
`;
