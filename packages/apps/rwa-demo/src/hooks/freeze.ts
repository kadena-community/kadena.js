import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { isFrozen } from '@/services/isFrozen';
import { getAsset } from '@/utils/getAsset';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';

export const useFreeze = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const { account } = useAccount();
  const { asset } = useAsset();
  const [frozen, setFrozen] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  const { data } = useEventSubscriptionSubscription({
    variables: {
      qualifiedName: `${getAsset(asset)}.ADDRESS-FROZEN`,
    },
  });

  useEffect(() => {
    const init = async (
      accountProp: IWalletAccount,
      investorAccountProp: string,
      asset: IAsset,
    ) => {
      if (isMounted) return;
      setIsMounted(true);
      const res = await isFrozen(
        {
          investorAccount: investorAccountProp,
          account: accountProp,
        },
        asset,
      );

      if (typeof res === 'boolean') {
        setFrozen(res);
      }
    };

    if (!account?.address || !investorAccount || !asset) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(account, investorAccount, asset);
  }, [account?.address, investorAccount, asset?.uuid, isMounted]);

  useEffect(() => {
    setIsMounted(false);
  }, [asset?.uuid, account?.address, investorAccount]);

  useEffect(() => {
    if (!data?.events?.length) return;

    data?.events?.map((evt) => {
      const params = JSON.parse(evt.parameters ?? '[]');
      if (params.length < 2 || params[0] !== investorAccount) return;

      setFrozen(params[1]);
    });
  }, [data]);

  return { frozen };
};
