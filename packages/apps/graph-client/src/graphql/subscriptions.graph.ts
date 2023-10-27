import { ALL_BLOCK_FIELDS } from './fields/block.graph';
import { ALL_EVENT_FIELDS, CORE_EVENT_FIELDS } from './fields/event.graph';
import { ALL_TRANSACTION_FIELDS } from './fields/transaction.graph';

import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const getBlocksSubscription: DocumentNode = gql`
  ${ALL_BLOCK_FIELDS}

  subscription getBlocks {
    newBlocks {
      ...AllBlockFields
      confirmationDepth
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
        ...CoreEventFields
      }
      signers {
        publicKey
        signature
      }
    }
  }
`;

export const getEventByName: DocumentNode = gql`
  ${ALL_EVENT_FIELDS}

  subscription getEventByName($eventName: String!) {
    event(eventName: $eventName) {
      ...AllEventFields
      block {
        id
      }
      transaction {
        requestKey
      }
    }
  }
`;
