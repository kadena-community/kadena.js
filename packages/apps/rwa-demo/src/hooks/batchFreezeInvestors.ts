import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IBatchSetAddressFrozenProps } from '@/services/batchSetAddressFrozen';
import { batchSetAddressFrozen } from '@/services/batchSetAddressFrozen';
import { RWAStore } from '@/utils/store';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';
import { useUser } from './user';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useBatchFreezeInvestors = () => {
  const { asset } = useAsset();
  const { user } = useUser();
  const { account, isMounted, accountRoles } = useAccount();
  const { paused } = useAsset();
  const { isActiveAccountChangeTx } = useTransactions();

  const [isAllowed, setIsAllowed] = useState(false);
  const { organisation } = useOrganisation();
  const { submit2Chain } = useSubmit2Chain();

  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const submit = async (
    data: IBatchSetAddressFrozenProps,
  ): Promise<ITransaction | undefined> => {
    return submit2Chain<IBatchSetAddressFrozenProps>(data, {
      notificationSentryName: 'error:submit:batchfreezeinvestors',
      successMessage: 'Batch freeze investors successful',
      chainFunction: async (account: IWalletAccount, asset: IAsset) => {
        if (!user) return Promise.resolve(undefined);
        const tx = batchSetAddressFrozen(data, account!, asset);
        (await store?.setFrozenMessages(data, user, asset)) as any;
        return tx;
      },
      transaction: {
        type: TXTYPES.FREEZEINVESTOR,
        accounts: [...data.investorAccounts, account!.address],
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
