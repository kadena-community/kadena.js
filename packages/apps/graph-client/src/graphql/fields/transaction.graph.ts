import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_TRANSACTION_FIELDS: DocumentNode = gql`
  fragment CoreTransactionFields on Transaction {
    hash
    cmd {
      meta {
        chainId
        creationTime
      }

      payload {
        ... on ExecPayload {
          code
        }
      }
    }
    result {
      height
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
        ... on ExecPayload {
          code
          data
        }
        ... on ContPayload {
          pactId
          step
          rollback
          data
          proof
        }
      }

      signers {
        publicKey
        signature
        capabilities
      }

      networkId
      nonce
    }

    result {
      badResult
      continuation
      gas
      goodResult
      logs
      metadata
      eventCount
      transactionId
    }

    # block {}
    # events {}
  }
`;
