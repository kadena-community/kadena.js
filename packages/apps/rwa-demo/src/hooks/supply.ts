import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { supply } from '@/services/supply';
import { getAsset } from '@/utils/getAsset';

import { useEffect, useState } from 'react';
import { useAccount } from './account';

export const useSupply = (asset?: IAsset) => {
  const [data, setData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { account } = useAccount();

  const { data: subscriptionData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.SUPPLY`,
    },
  });

  useEffect(() => {
    if (!asset) return;

    const init = async (asset: IAsset) => {
      if (isLoading || !account || isMounted) return;
      setIsLoading(true);
      setIsMounted(true);
      const res = await supply(
        {
          account: account,
        },
        asset,
      );

      if (typeof res === 'number') {
        setData(res);
      }
      setIsLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(asset);
  }, [account?.address, asset?.uuid, isLoading, isMounted]);

  useEffect(() => {
    setIsMounted(false);
  }, [asset?.uuid]);

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
