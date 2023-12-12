import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreAccountFields on FungibleAccount {
    accountName
    fungibleName
  }
`;

export const ALL_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_ACCOUNT_FIELDS}

  fragment AllAccountFields on FungibleAccount {
    ...CoreAccountFields
    id
    totalBalance

    # chainAccounts {}
    # transactions {}
    # transfers {}
  }
`;
