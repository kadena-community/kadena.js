import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const CORE_ACCOUNT_FIELDS: DocumentNode = gql`
  fragment CoreAccountFields on FungibleAccount {
    accountName
    totalBalance
    chainAccounts {
      chainId
      balance
      guard {
        keys
        predicate
      }
    }
  }
`;
