import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
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

export const useGetAgentRoles = (): IAgentHookProps & {
  setAssetRolesForAccount: (account: string, asset?: IAsset) => void;
} => {
  const [innerData, setInnerData] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [agent, setAgent] = useState<string | undefined>();
  const [asset, setAsset] = useState<IAsset | undefined>();

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.AGENT-ROLES-UPDATED`,
    },
  });

  const { data: subscriptionAgentRemovedData } =
    useEventSubscriptionSubscription({
      variables: {
        qualifiedName: `${getAsset(asset)}.AGENT-REMOVED`,
      },
    });

  const { data: subscriptionAgentAddedData } = useEventSubscriptionSubscription(
    {
      variables: {
        qualifiedName: `${getAsset(asset)}.AGENT-ADDED`,
      },
    },
  );

  const initInnerData = async (agentArg: string, asset: IAsset) => {
    const data = await getAgentRoles({ agent: agentArg }, asset);

    setInnerData(data);
    setIsMounted(true);
  };

  useEffect(() => {
    if (!agent || !asset) {
      setInnerData([]);
      setIsMounted(true);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData(agent, asset);
  }, [agent, asset]);

  useEffect(() => {
    if (!asset) return;
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
          initInnerData(agent, asset);
        }
      });
  }, [
    subscriptionData,
    subscriptionAgentRemovedData,
    subscriptionAgentAddedData,
    asset,
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

  const setAssetRolesForAccount = async (account: string, asset?: IAsset) => {
    setAgent(account);
    setAsset(asset);
  };

  return {
    isMounted,
    getAll,
    isAgentAdmin,
    isFreezer,
    isTransferManager,
    setAssetRolesForAccount,
  };
};
