import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const coreEvents: DocumentNode = gql`
  subscription eventSubscription($qualifiedName: String!) {
    events(qualifiedEventName: $qualifiedName) {
      parameters
    }
  }
`;
