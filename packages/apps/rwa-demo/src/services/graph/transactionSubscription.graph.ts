import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const transactionsQuery: DocumentNode = gql`
  subscription transaction($requestKey: String!) {
    transaction(requestKey: $requestKey) {
      result {
        ... on TransactionResult {
          badResult
          goodResult
        }
      }
    }
  }
`;
