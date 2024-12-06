import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { isPaused } from '@/services/isPaused';
import { getAsset } from '@/utils/getAsset';
import type * as Apollo from '@apollo/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';

export type EventSubscriptionQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const getEventsDocument = (
  variables: EventSubscriptionQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const usePaused = () => {
  const [paused, setPaused] = useState(true);
  const { account } = useAccount();

  const { data: pausedData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `RWA.${getAsset()}.PAUSED`,
    },
  });
  const { data: unpausedData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `RWA.${getAsset()}.UNPAUSED`,
    },
  });

  const init = async () => {
    if (!account) return;
    const res = await isPaused({
      account: account,
    });

    if (typeof res === 'boolean') {
      setPaused(res);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [account?.address]);

  useEffect(() => {
    if (!unpausedData?.events?.length) return;

    setPaused(false);
  }, [unpausedData]);

  useEffect(() => {
    if (!pausedData?.events?.length) return;

    setPaused(true);
  }, [pausedData]);

  return { paused };
};
