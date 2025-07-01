import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { getFrozenTokens } from '@/services/getFrozenTokens';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';

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

  const { data: subscriptionUnFreezeData } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset()}.TOKENS-UNFROZEN`,
    },
  });

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

  useEffect(() => {
    if (!asset) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(asset);
  }, [account?.address, investorAccount, asset?.uuid]);

  useEffect(() => {
    if (
      (subscriptionData?.events?.length ||
        subscriptionUnFreezeData?.events?.length) &&
      asset
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      init(asset);
    }
  }, [asset?.uuid, subscriptionData, subscriptionUnFreezeData]);

  return { data };
};
