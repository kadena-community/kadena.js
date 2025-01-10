import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const CORE_TRANSFER_FIELDS: DocumentNode = gql`
  fragment CoreTransferFields on Transfer {
    amount
    senderAccount
    requestKey
    receiverAccount
    transaction {
      hash
      result {
        ... on TransactionResult {
          block {
            height
          }
        }
      }
    }
  }
`;

export const ALL_TRANSFER_FIELDS: DocumentNode = gql`
  ${CORE_TRANSFER_FIELDS}

  fragment AllTransferFields on Transfer {
    ...CoreTransferFields
    block {
      hash
    }
    id
    moduleHash
    moduleName
    orderIndex

    # creationTime
    # blocks {}
  }
`;
