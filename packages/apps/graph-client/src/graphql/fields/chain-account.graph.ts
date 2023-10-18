import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_CHAIN_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreChainAccountFields on ChainModuleAccount {
    balance
    chainId
  }
`;

export const ALL_CHAIN_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_CHAIN_ACCOUNT_FIELDS}

  fragment AllChainAccountFields on ChainModuleAccount {
    ...CoreChainAccountFields
    accountName
    guard {
      keys
      predicate
    }
    moduleName

    # transactions {}
    # transfers {}
  }
`;
