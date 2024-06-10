import { gql } from '@apollo/client';
import { DocumentNode } from 'graphql';

export const coreEvents: DocumentNode = gql`
  query events($qualifiedName: String!) {
    events(qualifiedEventName: $qualifiedName) {
      edges {
        node {
          ...CoreEventsFields
        }
      }
    }
  }
`;
