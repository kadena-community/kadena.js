import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IBatchSetAddressFrozenProps } from '@/services/batchSetAddressFrozen';
import { batchSetAddressFrozen } from '@/services/batchSetAddressFrozen';
import { getClient } from '@/utils/client';
import { store } from '@/utils/store';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';

export const useBatchFreezeInvestors = () => {
  const { organisation } = useOrganisation();
  const { asset } = useAsset();
  const { account, sign, isMounted, accountRoles } = useAccount();
  const { paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: IBatchSetAddressFrozenProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await batchSetAddressFrozen(data, account!);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await store.setFrozenMessages(data, organisation?.id, asset);
      const signedTransaction = await sign(tx);

      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.FREEZEINVESTOR,
        accounts: [...data.investorAccounts, account!.address],
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
