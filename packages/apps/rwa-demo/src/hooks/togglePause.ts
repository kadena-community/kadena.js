import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { ITogglePauseProps } from '@/services/togglePause';
import { togglePause } from '@/services/togglePause';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useTogglePause = () => {
  const { asset } = useAsset();
  const { account, sign, isMounted, accountRoles } = useAccount();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: ITogglePauseProps,
  ): Promise<ITransaction | undefined> => {
    if (!asset) {
      addNotification({
        intent: 'negative',
        label: 'asset not found',
        message: '',
      });
      return;
    }
    try {
      const tx = await togglePause(data, account!, asset);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.PAUSECONTRACT,
        accounts: [account?.address!],
      });
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    }
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
