import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_NON_FUNGIBLE_CHAIN_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreNonFungibleChainAccountFields on NonFungibleChainAccount {
    chainId
    accountName
  }
`;

export const ALL_NON_FUNGIBLE_CHAIN_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_NON_FUNGIBLE_CHAIN_ACCOUNT_FIELDS}

  fragment AllNonFungibleChainAccountFields on NonFungibleChainAccount {
    ...CoreNonFungibleChainAccountFields
    accountName
    nonFungibleTokenBalances {
      balance
      id
    }

    # transactions {}
  }
`;
