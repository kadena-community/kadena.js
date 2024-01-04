import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_CHAIN_NON_FUNGIBLE_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreChainNonFungibleAccountFields on ChainNonFungibleAccount {
    chainId
    accountName
  }
`;

export const ALL_CHAIN_NON_FUNGIBLE_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_CHAIN_NON_FUNGIBLE_ACCOUNT_FIELDS}

  fragment AllChainNonFungibleAccountFields on ChainNonFungibleAccount {
    ...CoreChainNonFungibleAccountFields
    accountName
    guard {
      keys
      predicate
    }
    nonFungibles {
      balance
      id
    }

    # transactions {}
  }
`;
