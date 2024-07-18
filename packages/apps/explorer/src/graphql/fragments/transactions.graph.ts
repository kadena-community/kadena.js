import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const CORE_TRANSACTION_FIELDS: DocumentNode = gql`
  fragment CoreTransactionFields on Transaction {
    hash
    cmd {
      meta {
        sender
        chainId
      }
      payload {
        ... on ExecutionPayload {
          code
        }
      }
    }
    result {
      ... on TransactionResult {
        badResult
        goodResult
        block {
          height
        }
      }
    }
  }
`;

export const ALL_TRANSACTION_FIELDS: DocumentNode = gql`
  fragment AllTransactionFields on Transaction {
    ...CoreTransactionFields
    id
    cmd {
      meta {
        creationTime
        gasLimit
        gasPrice
        ttl
      }
      networkId
      nonce
      payload {
        ... on ContinuationPayload {
          data
          pactId
          proof
          rollback
          step
        }
        ... on ExecutionPayload {
          data
        }
      }
      signers {
        id
        address
        clist {
          args
          name
        }
        orderIndex
        pubkey
        scheme
      }
    }
  }
`;
