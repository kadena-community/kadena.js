import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getInvestorBalance } from '@/services/getInvestorBalance';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';

export type EventSubscriptionQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const useGetInvestorBalance = ({
  investorAccount,
  account,
}: {
  investorAccount?: string;
  account?: IWalletAccount;
}) => {
  const [data, setData] = useState(0);
  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.RECONCILE`,
    },
  });

  const init = async () => {
    if (!account || !investorAccount) return;
    const res = await getInvestorBalance({
      investorAccount,
      account: account!,
    });

    if (typeof res === 'number') {
      setData(res);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [account?.address, investorAccount]);

  console.log(`${getAsset()}.MINT-INVESTOR`, subscriptionData?.events);
  useEffect(() => {
    console.log({ subscriptionData });
    if (!subscriptionData?.events?.length) return;

    subscriptionData.events?.map((event) => {
      const params = JSON.parse(event.parameters ?? '[]');
      console.log({ params });
      if (params[0] === investorAccount && params.length === 2) {
        setData(parseInt(params[1]));
      }
    });
  }, [subscriptionData]);

  return { data };
};
