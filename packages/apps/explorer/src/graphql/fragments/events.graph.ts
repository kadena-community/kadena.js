import { gql } from '@apollo/client';
import { DocumentNode } from 'graphql';

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
