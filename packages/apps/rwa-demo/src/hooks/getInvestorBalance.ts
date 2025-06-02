import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
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
      const res = await getInvestorBalance(
        {
          investorAccount,
        },
        asset,
      );

      if (typeof res === 'number') {
        setData(res);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(asset);
  }, [investorAccount, asset]);

  useEffect(() => {
    if (!subscriptionData?.events?.length) return;

    subscriptionData.events?.map((event) => {
      const params = JSON.parse(event.parameters ?? '[]');

      const txAmount = params.length >= 1 && params[0];
      const senderAccount = params.length >= 2 && params[1];
      const receiverAccount = params.length >= 3 && params[2];

      if (senderAccount && senderAccount.account === investorAccount) {
        setData((prevValue) => prevValue - txAmount);
      }
      if (receiverAccount && receiverAccount.account === investorAccount) {
        setData((prevValue) => prevValue + txAmount);
      }
    });
  }, [subscriptionData]);

  return { data };
};
