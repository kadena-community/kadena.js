import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { ISetAddressFrozenProps } from '@/services/setAddressFrozen';
import { setAddressFrozen } from '@/services/setAddressFrozen';
import { RWAStore } from '@/utils/store';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';
import { useUser } from './user';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useFreezeInvestor = () => {
  const { account, isMounted, accountRoles } = useAccount();
  const { user } = useUser();
  const { asset, paused } = useAsset();
  const { isActiveAccountChangeTx } = useTransactions();
  const [isAllowed, setIsAllowed] = useState(false);
  const { organisation } = useOrganisation();
  const { submit2Chain } = useSubmit2Chain();

  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const submit = async (
    data: ISetAddressFrozenProps,
  ): Promise<ITransaction | undefined> => {
    return submit2Chain<ISetAddressFrozenProps>(data, {
      notificationSentryName: 'error:submit:freezeinvestor',
      chainFunction: async (account: IWalletAccount, asset: IAsset) => {
        if (!user) return Promise.resolve(undefined);
        await store?.setFrozenMessage(data, user, asset);
        return setAddressFrozen(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.FREEZEINVESTOR,
        accounts: [data.investorAccount],
      },
    });
  };

  useEffect(() => {
    if (!isMounted) return;
    setIsAllowed(
      !paused && accountRoles.isFreezer() && !isActiveAccountChangeTx,
    );
  }, [
    paused,
    account?.address,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
    asset?.uuid,
  ]);

  return { submit, isAllowed };
};
