import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { getInvestorCount } from '@/services/getInvestorCount';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';

export const useGetInvestorCount = (asset?: IAsset) => {
  const [innerData, setInnerData] = useState<number>(0);

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.RECONCILE`,
    },
  });

  const initInnerData = async (asset: IAsset) => {
    const data = await getInvestorCount(asset);
    setInnerData(data);
  };

  useEffect(() => {
    if (!subscriptionData?.events?.length || !asset) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData(asset);
  }, [asset, subscriptionData]);

  return { data: innerData };
};
