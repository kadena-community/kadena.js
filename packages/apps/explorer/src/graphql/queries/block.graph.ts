import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { ALL_BLOCK_FIELDS } from '../fragments/block.graph';
import { CORE_TRANSACTION_FIELDS } from '../fragments/transactions.graph';

export const block: DocumentNode = gql`
  ${ALL_BLOCK_FIELDS}
  ${CORE_TRANSACTION_FIELDS}

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
      transactions(first: 500) {
        totalCount
        edges {
          node {
            ...CoreTransactionFields
          }
        }
      }
    }
  }
`;
