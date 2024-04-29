import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_FUNGIBLE_CHAIN_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreFungibleChainAccountFields on FungibleChainAccount {
    balance
    chainId
  }
`;

export const ALL_FUNGIBLE_CHAIN_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_FUNGIBLE_CHAIN_ACCOUNT_FIELDS}

  fragment AllFungibleChainAccountFields on FungibleChainAccount {
    ...CoreFungibleChainAccountFields
    accountName
    guard {
      ... on Keyset {
        keys
        predicate
      }
    }
    fungibleName

    # transactions {}
    # transfers {}
  }
`;
