import type { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';

export const getBlocksSubscription: DocumentNode = gql`
  subscription getBlocks {
    newBlocks
  }
`;

export const getTransactionByRequestKey: DocumentNode = gql`
  subscription getTransactionByRequestKey($requestKey: String!) {
    transaction(requestKey: $requestKey)
  }
`;

export const getEventsByName: DocumentNode = gql`
  subscription getEventsByName($qualifiedEventName: String!) {
    events(qualifiedEventName: $qualifiedEventName)
  }
`;
