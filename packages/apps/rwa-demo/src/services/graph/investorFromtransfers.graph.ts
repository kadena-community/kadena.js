import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const investorFromtransfers: DocumentNode = gql`
  query investorTransfersEvents(
    $qualifiedName: String!
    $parametersFilter: String!
  ) {
    events(
      qualifiedEventName: $qualifiedName
      parametersFilter: $parametersFilter
    ) {
      edges {
        node {
          requestKey
          parameterText
          block {
            creationTime
          }
        }
      }
    }
  }
`;
