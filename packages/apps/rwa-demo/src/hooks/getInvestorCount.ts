import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { getInvestorCount } from '@/services/getInvestorCount';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';

export const useGetInvestorCount = (asset?: IAsset) => {
  const [innerData, setInnerData] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.RECONCILE`,
    },
  });

  useEffect(() => {
    if (!subscriptionData?.events?.length || !asset) return;

    const initInnerData = async (asset: IAsset) => {
      if (isMounted) return;
      setIsMounted(true);
      const data = await getInvestorCount(asset);
      setInnerData(data);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData(asset);
  }, [asset?.uuid, subscriptionData?.events?.length, isMounted]);

  useEffect(() => {
    setIsMounted(false);
  }, [asset?.uuid, subscriptionData?.events?.length]);

  return { data: innerData };
};
