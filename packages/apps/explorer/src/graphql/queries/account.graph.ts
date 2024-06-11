import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const account: DocumentNode = gql`
  query account($accountName: String!) {
    fungibleAccount(accountName: $accountName) {
      ...CoreAccountFields
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

export const coreAccount: DocumentNode = gql`
  query coreAccount($accountName: String!) {
    fungibleAccount(accountName: $accountName) {
      ...CoreAccountFields
    }
  }
`;
