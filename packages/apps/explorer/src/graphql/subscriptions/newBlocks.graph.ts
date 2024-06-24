import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { CORE_BLOCK_FIELDS } from '../fragments/block.graph';
import { CORE_TRANSACTION_FIELDS } from '../fragments/transactions.graph';

export const newBlocks: DocumentNode = gql`
  ${CORE_BLOCK_FIELDS}
  ${CORE_TRANSACTION_FIELDS}

  subscription newBlocks {
    newBlocks {
      ...CoreBlockFields
      transactions {
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
