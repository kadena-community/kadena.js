import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_TRANSACTION_FIELDS: DocumentNode = gql`
  fragment CoreTransactionFields on Transaction {
    chainId
    code
    creationTime
    height
    requestKey
  }
`;

export const ALL_TRANSACTION_FIELDS: DocumentNode = gql`
  ${CORE_TRANSACTION_FIELDS}

  fragment AllTransactionFields on Transaction {
    ...CoreTransactionFields
    id
    badResult
    continuation
    data
    gas
    gasLimit
    gasPrice
    goodResult
    logs
    metadata
    nonce
    eventCount
    pactId
    proof
    rollback
    senderAccount
    step
    ttl
    transactionId

    # block {}
    # events {}
  }
`;
