import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const GET_TOKENS: DocumentNode = gql`
  query GetTokens($accountName: String!) {
    nonFungibleAccount(accountName: $accountName) {
      accountName
      id
      nonFungibles {
        balance
        id
        info {
          uri
        }
      }
    }
  }
`;
