import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { supply } from '@/services/supply';
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

export const useSupply = () => {
  const [data, setData] = useState(0);
  const { account } = useAccount();

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `RWA.${getAsset()}.SUPPLY`,
    },
  });

  const init = async () => {
    if (!account) return;
    const res = await supply({
      account: account,
    });

    if (typeof res === 'number') {
      setData(res);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [account]);

  useEffect(() => {
    if (!subscriptionData?.events?.length) return;
    if (!subscriptionData?.events[0].parameters?.length) return;

    const newSupply = JSON.parse(subscriptionData?.events[0].parameters)[0];
    if (typeof newSupply === 'number') {
      setData(newSupply);
    }
  }, [subscriptionData]);

  return { data };
};
