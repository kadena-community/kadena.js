import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const blockHeight: DocumentNode = gql`
  query blocksFromHeight($startHeight: Int!, $endHeight: Int!) {
    block(startHeight: $startHeight, endHeight: $endHeight) {
      edges {
        node {
          hash
          chainId
        }
      }

  }
`;
