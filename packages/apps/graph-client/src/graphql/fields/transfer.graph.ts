import { DocumentNode, gql } from '@apollo/client';

export const CORE_TRANSFER_FIELDS: DocumentNode = gql`
  fragment CoreTransferFields on Transfer {
    amount
    chainId
    senderAccount
    height
    requestKey
    receiverAccount
  }
`;

export const ALL_TRANSFER_FIELDS: DocumentNode = gql`
  ${CORE_TRANSFER_FIELDS}

  fragment AllTransferFields on Transfer {
    ...CoreTransferFields
    blockHash
    id
    moduleHash
    moduleName
    orderIndex

    # blocks {}
  }
`;
