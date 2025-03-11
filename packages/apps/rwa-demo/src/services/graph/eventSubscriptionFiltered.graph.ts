import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const coreEvents: DocumentNode = gql`
  subscription eventSubscriptionFiltered(
    $qualifiedName: String!
    $parametersFilter: String!
  ) {
    events(
      qualifiedEventName: $qualifiedName
      parametersFilter: $parametersFilter
    ) {
      parameters
    }
  }
`;
