import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import { getInvestorCount } from '@/services/getInvestorCount';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';

export const useGetInvestorCount = () => {
  const [innerData, setInnerData] = useState<number>(0);

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.RECONCILE`,
    },
  });

  const initInnerData = async () => {
    const data = await getInvestorCount();
    setInnerData(data);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData();
  }, []);

  useEffect(() => {
    if (!subscriptionData?.events?.length) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData();
  }, [subscriptionData]);

  return { data: innerData };
};
