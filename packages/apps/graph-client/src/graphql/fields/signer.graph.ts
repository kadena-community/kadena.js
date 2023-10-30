import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const CORE_SIGNER_KEY_FIELDS: DocumentNode = gql`
  fragment CoreSignerKeyFields on Signer {
    capabilities
    publicKey
    requestKey
    signature
  }
`;

export const ALL_SIGNER_KEY_FIELDS: DocumentNode = gql`
  ${CORE_SIGNER_KEY_FIELDS}

  fragment AllSignerKeyFields on Signer {
    ...CoreSignerKeyFields
    orderIndex
    address
    scheme
  }
`;
