import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_NON_FUNGIBLE_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreNonFungibleAccountFields on NonFungibleAccount {
    accountName
  }
`;

export const ALL_NON_FUNGIBLE_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_NON_FUNGIBLE_ACCOUNT_FIELDS}

  fragment AllNonFungibleAccountFields on NonFungibleAccount {
    ...CoreNonFungibleAccountFields
    id

    # chainAccounts {}
    # transactions {}
  }
`;
