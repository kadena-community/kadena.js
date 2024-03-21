import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';
import { ALL_EVENT_FIELDS, CORE_EVENT_FIELDS } from './fields/event.graph';
import { ALL_TRANSACTION_FIELDS } from './fields/transaction.graph';

export const getBlocksSubscription: DocumentNode = gql`
  subscription getBlocks {
    newBlocks {
      height
      hash
      chainId
      creationTime
      transactions {
        totalCount
      }
    }
  }
`;

export const getTransactionByRequestKey: DocumentNode = gql`
  ${ALL_TRANSACTION_FIELDS}
  ${CORE_EVENT_FIELDS}

  subscription getTransactionByRequestKey($requestKey: String!) {
    transaction(requestKey: $requestKey) {
      ...AllTransactionFields
      block {
        hash
      }
      events {
        edges {
          node {
            ...CoreEventFields
          }
        }
      }
      cmd {
        signers {
          publicKey
          signature
        }
      }
    }
  }
`;

export const getEventsByName: DocumentNode = gql`
  ${ALL_EVENT_FIELDS}

  subscription getEventsByName(
    $qualifiedEventName: String!
    $parametersFilter: String
  ) {
    events(
      qualifiedEventName: $qualifiedEventName
      parametersFilter: $parametersFilter
    ) {
      ...AllEventFields
      block {
        id
      }
      transaction {
        hash
      }
    }
  }
`;
