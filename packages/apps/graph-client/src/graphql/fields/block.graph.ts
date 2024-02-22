import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_BLOCK_FIELDS: DocumentNode = gql`
  fragment CoreBlockFields on Block {
    chainId
    hash
    height
    payloadHash
  }
`;

export const ALL_BLOCK_FIELDS: DocumentNode = gql`
  ${CORE_BLOCK_FIELDS}

  fragment AllBlockFields on Block {
    ...CoreBlockFields
    creationTime
    epoch
    id
    powHash

    # confirmationDepth // default excluded since it's a heavy query
    # minerAccount {}
    # parent {}
    # transactions {}
    # events {}
  }
`;
