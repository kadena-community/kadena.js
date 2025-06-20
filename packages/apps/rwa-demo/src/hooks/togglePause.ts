import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { ITogglePauseProps } from '@/services/togglePause';
import { togglePause } from '@/services/togglePause';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useTogglePause = () => {
  const { asset } = useAsset();
  const { account, isMounted, accountRoles } = useAccount();
  const { isActiveAccountChangeTx } = useTransactions();

  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const submit = async (
    data: ITogglePauseProps,
  ): Promise<ITransaction | undefined> => {
    return submit2Chain<ITogglePauseProps>(data, {
      notificationSentryName: 'error:submit:togglepause',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return togglePause(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.PAUSECONTRACT,
        accounts: [account?.address!],
      },
    });
  };

  useEffect(() => {
    if (!isMounted) return;
    setIsAllowed(accountRoles.isFreezer() && !isActiveAccountChangeTx);
  }, [
    account?.address,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
    asset,
  ]);

  return { submit, isAllowed };
};
