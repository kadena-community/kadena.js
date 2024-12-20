import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { ISetAddressFrozenProps } from '@/services/setAddressFrozen';
import { setAddressFrozen } from '@/services/setAddressFrozen';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useFreezeInvestor = () => {
  const { account, sign, isMounted, accountRoles } = useAccount();
  const { paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: ISetAddressFrozenProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await setAddressFrozen(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.FREEZEINVESTOR,
        accounts: [data.investorAccount],
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
    setIsAllowed(
      !paused && accountRoles.isFreezer() && !isActiveAccountChangeTx,
    );
  }, [
    paused,
    account?.address,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
  ]);

  return { submit, isAllowed };
};
