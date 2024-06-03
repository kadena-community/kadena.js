import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const block: DocumentNode = gql`
  query block($hash: String!) {
    block(hash: $hash) {
      ...AllBlockFields
      parent {
        hash
      }
      minerAccount {
        accountName
        guard {
          keys
          predicate
        }
      }
      neighbors {
        chainId
        hash
      }
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
