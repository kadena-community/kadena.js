import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const blockHeight: DocumentNode = gql`
  query blocksFromHeight($startHeight: Int!, $endHeight: Int!, $first: Int!) {
    blocksFromHeight(
      startHeight: $startHeight
      endHeight: $endHeight
      first: $first
    ) {
      edges {
        node {
          height
          hash
          chainId
        }
      }
    }
  }
`;
