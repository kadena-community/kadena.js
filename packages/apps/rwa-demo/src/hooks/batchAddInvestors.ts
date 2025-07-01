import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IBatchRegisterIdentityProps } from '@/services/batchRegisterIdentity';
import { batchRegisterIdentity } from '@/services/batchRegisterIdentity';
import { RWAStore } from '@/utils/store';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useBatchAddInvestors = () => {
  const { asset, paused } = useAsset();
  const { account, isOwner, accountRoles, isMounted } = useAccount();
  const { isActiveAccountChangeTx } = useTransactions();

  const [isAllowed, setIsAllowed] = useState(false);
  const { organisation } = useOrganisation();
  const { submit2Chain } = useSubmit2Chain();

  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const submit = async (
    data: Omit<IBatchRegisterIdentityProps, 'agent'>,
  ): Promise<ITransaction | undefined> => {
    const tx = await submit2Chain<Omit<IBatchRegisterIdentityProps, 'agent'>>(
      data,
      {
        notificationSentryName: 'error:submit:batchaddinvestor',
        chainFunction: (account: IWalletAccount, asset: IAsset) => {
          const newData: IBatchRegisterIdentityProps = {
            ...data,
            agent: account!,
          };

          return batchRegisterIdentity(newData, asset);
        },
        transaction: {
          type: TXTYPES.ADDINVESTOR,
          accounts: [
            account?.address!,
            ...data.accounts.map((account) => account.account.trim()),
          ],
        },
      },
    );

    const promises = await store?.setAllAccounts(data);
    await Promise.all(promises || []);
    return tx;
  };

  useEffect(() => {
    if (!isMounted) return;

    setIsAllowed(
      !paused &&
        (accountRoles.isAgentAdmin() || isOwner) &&
        !isActiveAccountChangeTx,
    );
  }, [
    paused,
    isOwner,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
    asset?.uuid,
  ]);

  return { submit, isAllowed };
};
