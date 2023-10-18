import { DocumentNode, gql } from '@apollo/client';

export const CORE_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreAccountFields on ModuleAccount {
    accountName
    moduleName
  }
`;

export const ALL_ACCOUNT_FIELDS: DocumentNode = gql`
  ${CORE_ACCOUNT_FIELDS}

  fragment AllAccountFields on ModuleAccount {
    ...CoreAccountFields
    id
    totalBalance

    # chainAccounts {}
    # transactions {}
    # transfers {}
  }
`;
