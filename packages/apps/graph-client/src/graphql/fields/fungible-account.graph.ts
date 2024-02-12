import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_FUNGIBLE_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreFungibleAccountFields on FungibleAccount {
    accountName
    fungibleName
  }
`;

export const ALL_FUNGIBLE_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_FUNGIBLE_ACCOUNT_FIELDS}

  fragment AllFungibleAccountFields on FungibleAccount {
    ...CoreFungibleAccountFields
    id
    totalBalance

    # chainAccounts {}
    # transactions {}
    # transfers {}
  }
`;
