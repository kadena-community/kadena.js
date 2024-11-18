import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventsQuery } from '@/__generated__/sdk';
import { coreEvents } from '@/services/graph/agent.graph';
import type * as Apollo from '@apollo/client';

export type EventQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const getEventsDocument = (
  variables: EventQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const useGetAgents = () => {
  const { loading, data, error } = useEventsQuery({
    variables: {
      qualifiedName: 'RWA.agent-role.AGENT-ADDED',
    },
  });

  const agents =
    data?.events.edges.map((edge: any) => {
      console.log(edge);

      return {
        blockHeight: edge.node.block.height,
        chainId: edge.node.chainId,
        requestKey: edge.node.requestKey,
        accountName: JSON.parse(edge.node.parameters)[0],
      };
    }) ?? [];

  return { loading, data: agents, error };
};
