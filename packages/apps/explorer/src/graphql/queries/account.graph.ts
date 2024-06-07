import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const block: DocumentNode = gql`
  query account($accountName: String!) {
    fungibleAccount(accountName: $accountName) {
      accountName
      totalBalance
      chainAccounts {
        chainId
        guard {
          keys
          predicate
        }
      }
      transactions {
        edges {
          node {
            ...CoreTransactionFields
          }
        }
      }
      transfers {
        edges {
          node {
            requestKey
            blockHash
            amount
            chainId
            receiverAccount
            senderAccount
            height
          }
        }
      }
    }
  }
`;
