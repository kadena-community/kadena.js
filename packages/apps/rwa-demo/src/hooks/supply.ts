import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
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

export const useSupply = (asset?: IAsset) => {
  const [data, setData] = useState(0);
  const { account } = useAccount();

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.SUPPLY`,
    },
  });

  useEffect(() => {
    if (!asset) return;

    const init = async (asset: IAsset) => {
      if (!account) return;
      const res = await supply(
        {
          account: account,
        },
        asset,
      );

      if (typeof res === 'number') {
        setData(res);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(asset);
  }, [account, asset]);

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
