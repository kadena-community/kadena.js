import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { CORE_BLOCK_FIELDS } from '../fragments/block.graph';

export const newBlocks: DocumentNode = gql`
  ${CORE_BLOCK_FIELDS}

  subscription newBlocks {
    newBlocks {
      ...CoreBlockFields
      transactions {
        totalCount
      }
    }
  }
`;
