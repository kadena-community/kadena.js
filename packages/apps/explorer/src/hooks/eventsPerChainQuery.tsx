import type { Exact, Scalars } from '@/__generated__/sdk';
import { CoreEventsFieldsFragmentDoc } from '@/__generated__/sdk';
import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';

const defaultOptions = {} as const;

export type EventsPerChainQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
  chains: Scalars['Int']['input'][];
}>;

export interface EventsQuery {
  __typename?: 'Query';
  events: {
    __typename?: 'QueryEventsConnection';
    edges: Array<{
      __typename?: 'QueryEventsConnectionEdge';
      node: {
        __typename?: 'Event';
        chainId: any;
        requestKey: string;
        parameters?: string | null;
        block: { __typename?: 'Block'; height: any };
      };
    }>;
  };
}

export const getEventsDocument = (
  variables: EventsPerChainQueryVariables = {
    chains: [],
    qualifiedName: '',
  },
): Apollo.DocumentNode => {
  if (!variables?.chains.length)
    return gql`
      query events {
        chains0: events(qualifiedEventName: "${variables?.qualifiedName}") {
          __typename
        }
      }
    `;
  return gql`
  query events {
    ${variables.chains.map(
      (c) => `
        chains${c}: events(qualifiedEventName: "${variables.qualifiedName}", chainId: "${c}") {
            edges {
                node {
                ...CoreEventsFields
                __typename
                }
                __typename
            }
            __typename
            }
    `,
    )}
    
  }
  ${CoreEventsFieldsFragmentDoc}
`;
};

export const useEventsPerChainQuery = (
  baseOptions: Apollo.QueryHookOptions<
    EventsQuery,
    EventsPerChainQueryVariables
  > &
    (
      | { variables: EventsPerChainQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) => {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EventsQuery, EventsPerChainQueryVariables>(
    getEventsDocument(baseOptions.variables),
    options,
  );
};
