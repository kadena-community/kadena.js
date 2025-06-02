import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { getFrozenTokens } from '@/services/getFrozenTokens';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { getAsset } from '@/utils/getAsset';
import type * as Apollo from '@apollo/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';

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
  const { asset } = useAsset();

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.TOKENS-FROZEN`,
    },
  });

  useEffect(() => {
    if (!asset) return;
    const init = async (asset: IAsset) => {
      if (!account || !investorAccount) return;
      const frozenRes = await getFrozenTokens(
        {
          investorAccount,
          account: account!,
        },
        asset,
      );

      if (typeof frozenRes === 'number') {
        setData(frozenRes);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(asset);
  }, [account?.address, investorAccount, asset]);

  useEffect(() => {
    if (!subscriptionData?.events?.length) return;

    subscriptionData.events?.map((event) => {
      const params = JSON.parse(event.parameters ?? '[]');
      if (params[0] === investorAccount && params.length === 2) {
        setData(parseInt(params[1]));
      }
    });
  }, [subscriptionData]);

  return { data };
};
