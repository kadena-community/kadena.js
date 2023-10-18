import { DocumentNode, gql } from '@apollo/client';

export const CORE_MINER_KEY_FIELDS: DocumentNode = gql`
  fragment CoreMinerKeyFields on Minerkey {
    blockHash
    id
    key
  }
`;

export const ALL_MINER_KEY_FIELDS: DocumentNode = gql`
  ${CORE_MINER_KEY_FIELDS}

  fragment AllMinerKeyFields on Minerkey {
    ...CoreMinerKeyFields

    # block {}
  }
`;
