import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const newBlocksSubscription: DocumentNode = gql`
  subscription newBlocks {
    newBlocks {
      ...CoreBlockFields
      transactions {
        edges {
          node {
            ...CoreTransactionFields
          }
        }
      }
    }
  }
`;
