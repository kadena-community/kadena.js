import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const CORE_EVENTS_FIELDS: DocumentNode = gql`
  fragment CoreEventsFields on Event {
    chainId
    block {
      height
    }
    requestKey
    parameters
  }
`;
