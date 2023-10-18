import { DocumentNode, gql } from '@apollo/client';

export const CORE_EVENT_FIELDS: DocumentNode = gql`
  fragment CoreEventFields on Event {
    parameterText
    qualifiedName
  }
`;

export const ALL_EVENT_FIELDS: DocumentNode = gql`
  ${CORE_EVENT_FIELDS}

  fragment AllEventFields on Event {
    ...CoreEventFields
    chainId
    height
    id
    moduleName
    name
    orderIndex
    requestKey

    # transaction {}
  }
`;
