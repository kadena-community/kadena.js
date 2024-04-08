import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_TRANSACTION_FIELDS: DocumentNode = gql`
  fragment CoreTransactionFields on Transaction {
    hash
    sigs {
      sig
    }
    cmd {
      meta {
        chainId
        creationTime
      }

      payload {
        ... on ExecutionPayload {
          code
        }
      }
    }
    result {
      ... on TransactionResult {
        height
      }
    }
  }
`;

export const ALL_TRANSACTION_FIELDS: DocumentNode = gql`
  ${CORE_TRANSACTION_FIELDS}

  fragment AllTransactionFields on Transaction {
    ...CoreTransactionFields
    id

    cmd {
      meta {
        gasLimit
        gasPrice
        sender
        ttl
      }

      payload {
        ... on ExecutionPayload {
          code
          data
        }
        ... on ContinuationPayload {
          pactId
          step
          rollback
          data
          proof
        }
      }

      signers {
        pubkey
        clist {
          name
          args
        }
      }

      networkId
      nonce
    }

    result {
      ... on TransactionResult {
        badResult
        continuation
        gas
        goodResult
        logs
        metadata
        eventCount
        transactionId
      }
      ... on TransactionMempoolInfo {
        status
      }
    }

    # block {}
    # events {}
  }
`;
