import { gql } from '@apollo/client';

import type { DocumentNode } from 'graphql';

export const transaction: DocumentNode = gql`
  query transaction($requestKey: String!) {
    transaction(requestKey: $requestKey) {
      ...AllTransactionFields

      result {
        ... on TransactionResult {
          ...TransactionResultFragment
        }
      }
    }
  }
`;

export const TransactionResultFragment: DocumentNode = gql`
  fragment TransactionResultFragment on TransactionResult {
    block {
      height
      hash
      creationTime
    }
    logs
    gas
    badResult
    transactionId
    continuation
    metadata
    events {
      edges {
        node {
          qualifiedName
          parameters
        }
      }
    }
  }
`;
