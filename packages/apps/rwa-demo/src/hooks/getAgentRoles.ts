import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { AGENTROLES } from '@/services/addAgent';
import { getAgentRoles } from '@/services/getAgentRoles';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { getAsset } from '@/utils/getAsset';
import type * as Apollo from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

export interface IAgentHookProps {
  isMounted: boolean;
  getAll: () => string[];
  isAgentAdmin: () => boolean;
  isFreezer: () => boolean;
  isTransferManager: () => boolean;
}

export type EventQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const getEventsDocument = (
  variables: EventQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const getEventsSubscription = (
  variables: EventQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const useGetAgentRoles = ({
  agent,
}: {
  agent?: string;
}): IAgentHookProps => {
  const [innerData, setInnerData] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.AGENT-ROLES-UPDATED`,
    },
  });

  const { data: subscriptionAgentRemovedData } =
    useEventSubscriptionSubscription({
      variables: {
        qualifiedName: `${getAsset()}.AGENT-REMOVED`,
      },
    });

  const { data: subscriptionAgentAddedData } = useEventSubscriptionSubscription(
    {
      variables: {
        qualifiedName: `${getAsset()}.AGENT-ADDED`,
      },
    },
  );

  const initInnerData = async (agentArg: string) => {
    const data = await getAgentRoles({ agent: agentArg });

    setInnerData(data);
    setIsMounted(true);
  };

  useEffect(() => {
    if (!agent) {
      setInnerData([]);
      setIsMounted(true);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData(agent);
  }, [agent]);

  useEffect(() => {
    const { events: rolesUpdatedEvents } = subscriptionData ?? {};
    const { events: agentRemovedEvents } = subscriptionAgentRemovedData ?? {};
    const { events: agentAddedEvents } = subscriptionAgentAddedData ?? {};

    [rolesUpdatedEvents, agentRemovedEvents, agentAddedEvents]
      .flat()
      ?.find((event) => {
        if (!event) return;
        const params = JSON.parse(event.parameters ?? '[]');
        if (params[0] === agent && !!agent) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          initInnerData(agent!);
        }
      });
  }, [
    subscriptionData,
    subscriptionAgentRemovedData,
    subscriptionAgentAddedData,
  ]);

  const getAll = useCallback(() => {
    return innerData;
  }, [innerData]);

  const isAgentAdmin = useCallback(() => {
    return innerData.indexOf(AGENTROLES.AGENTADMIN) >= 0;
  }, [innerData]);
  const isFreezer = useCallback(() => {
    return innerData.indexOf(AGENTROLES.FREEZER) >= 0;
  }, [innerData]);

  const isTransferManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.TRANSFERMANAGER) >= 0;
  }, [innerData]);

  return {
    isMounted,
    getAll,
    isAgentAdmin,
    isFreezer,
    isTransferManager,
  };
};
