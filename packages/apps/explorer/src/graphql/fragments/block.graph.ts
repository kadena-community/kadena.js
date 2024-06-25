import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const CORE_BLOCK_FIELDS: DocumentNode = gql`
  fragment CoreBlockFields on Block {
    id
    height
    hash
    chainId
    creationTime
    difficulty
  }
`;

export const ALL_BLOCK_FIELDS: DocumentNode = gql`
  ${CORE_BLOCK_FIELDS}

  fragment AllBlockFields on Block {
    ...CoreBlockFields
    epoch
    id
    weight
    payloadHash
    powHash
    target
    flags
    nonce
  }
`;
