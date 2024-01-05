import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_CHAIN_NON_FUNGIBLE_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreNonFungibleChainAccountFields on NonFungibleChainAccount {
    chainId
    accountName
  }
`;

export const ALL_CHAIN_NON_FUNGIBLE_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_CHAIN_NON_FUNGIBLE_ACCOUNT_FIELDS}

  fragment AllNonFungibleChainAccountFields on NonFungibleChainAccount {
    ...CoreNonFungibleChainAccountFields
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
