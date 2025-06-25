import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { getInvestorBalance } from '@/services/getInvestorBalance';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';
import { useAsset } from './asset';

export type EventSubscriptionQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const useGetInvestorBalance = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState(0);
  const { asset } = useAsset();
  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.RECONCILE`,
    },
  });

  useEffect(() => {
    if (!asset) return;

    const init = async (asset: IAsset) => {
      if (!investorAccount) return;
      setIsPending(true);
      const res = await getInvestorBalance(
        {
          investorAccount,
        },
        asset,
      );

      if (typeof res === 'number') {
        setData(res);
      }

      setIsPending(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(asset);
  }, [investorAccount, asset]);

  useEffect(() => {
    if (!subscriptionData?.events?.length) return;

    subscriptionData.events?.map((event) => {
      const params = JSON.parse(event.parameters ?? '[]');

      const senderAccount = params.length >= 2 && params[1];
      const receiverAccount = params.length >= 3 && params[2];

      if (senderAccount && senderAccount.account === investorAccount) {
        setData(() => senderAccount.current);
      }
      if (receiverAccount && receiverAccount.account === investorAccount) {
        setData(() => receiverAccount.current);
      }
    });
  }, [subscriptionData]);

  return { data, isPending };
};
