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
  isSupplyModifier: () => boolean;
  isFreezer: () => boolean;
  isTransferManager: () => boolean;
  isRecoveryManager: () => boolean;
  isComplianceManager: () => boolean;
  isWhitelistManager: () => boolean;
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
      qualifiedName: `${getAsset()}.ROLE_UPDATED`,
    },
  });

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
    subscriptionData?.events?.map((event) => {
      const params = JSON.parse(event.parameters ?? '[]');
      if (params[0] === agent) {
        setInnerData(params[1]);
      }
    });
  }, [subscriptionData]);

  const getAll = useCallback(() => {
    return innerData;
  }, [innerData]);

  const isAgentAdmin = useCallback(() => {
    return innerData.indexOf(AGENTROLES.AGENTADMIN) >= 0;
  }, [innerData]);

  const isSupplyModifier = useCallback(() => {
    return innerData.indexOf(AGENTROLES.SUPPLYMODIFIER) >= 0;
  }, [innerData]);

  const isFreezer = useCallback(() => {
    return innerData.indexOf(AGENTROLES.FREEZER) >= 0;
  }, [innerData]);

  const isTransferManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.TRANSFERMANAGER) >= 0;
  }, [innerData]);

  const isRecoveryManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.RECOVERY) >= 0;
  }, [innerData]);

  const isComplianceManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.COMPLIANCE) >= 0;
  }, [innerData]);

  const isWhitelistManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.WHITELISTMANAGER) >= 0;
  }, [innerData]);

  return {
    isMounted,
    getAll,
    isAgentAdmin,
    isSupplyModifier,
    isFreezer,
    isTransferManager,
    isRecoveryManager,
    isComplianceManager,
    isWhitelistManager,
  };
};
