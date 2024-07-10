import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { CORE_ACCOUNT_FIELDS } from '../fragments/account.graph';
import { CORE_TRANSACTION_FIELDS } from '../fragments/transactions.graph';

export const account: DocumentNode = gql`
  ${CORE_ACCOUNT_FIELDS}
  ${CORE_TRANSACTION_FIELDS}

  query account($accountName: String!) {
    fungibleAccount(accountName: $accountName) {
      ...CoreAccountFields
      transactions {
        totalCount
      }
      transfers {
        totalCount
      }
    }
  }
`;

export const coreAccount: DocumentNode = gql`
  query coreAccount($accountName: String!) {
    fungibleAccount(accountName: $accountName) {
      ...CoreAccountFields
    }
  }
`;
