import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
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

export const usePaused = (asset?: IAsset) => {
  const [paused, setPaused] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { account } = useAccount();

  const { data: pausedData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.PAUSED`,
    },
  });
  const { data: unpausedData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.UNPAUSED`,
    },
  });

  useEffect(() => {
    const init = async () => {
      if (!account || !asset || isMounted) return;
      setIsMounted(true);
      const res = await isPaused(
        {
          account: account,
        },
        asset,
      );

      if (typeof res === 'boolean') {
        setPaused(res);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [account?.address, asset?.uuid, isMounted]);

  useEffect(() => {
    setIsMounted(false);
  }, [asset?.uuid]);

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
