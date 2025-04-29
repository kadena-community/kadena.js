import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { getFrozenTokens } from '@/services/getFrozenTokens';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
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

export const useGetFrozenTokens = ({
  investorAccount,
}: {
  investorAccount: string;
}) => {
  const [data, setData] = useState(0);
  const { account } = useAccount();

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.TOKENS-FROZEN`,
    },
  });

  const { data: subscriptionUnFreezeData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.TOKENS-UNFROZEN`,
    },
  });

  const init = async () => {
    if (!account || !investorAccount) return;
    const frozenRes = await getFrozenTokens({
      investorAccount,
      account: account!,
    });

    if (typeof frozenRes === 'number') {
      setData(frozenRes);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [account?.address, investorAccount]);

  useEffect(() => {
    if (
      subscriptionData?.events?.length ||
      subscriptionUnFreezeData?.events?.length
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      init();
    }
  }, [subscriptionData, subscriptionUnFreezeData]);

  return { data };
};
