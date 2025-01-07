import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { IBatchRegisterIdentityProps } from '@/services/batchRegisterIdentity';
import { batchRegisterIdentity } from '@/services/batchRegisterIdentity';
import { getClient } from '@/utils/client';
import { store } from '@/utils/store';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useBatchAddInvestors = () => {
  const { paused } = useAsset();
  const { account, sign, accountRoles, isMounted } = useAccount();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: Omit<IBatchRegisterIdentityProps, 'agent'>,
  ): Promise<ITransaction | undefined> => {
    const newData: IBatchRegisterIdentityProps = { ...data, agent: account! };
    try {
      const tx = await batchRegisterIdentity(newData);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.ADDINVESTOR,
        accounts: [
          account?.address!,
          ...data.accounts.map((account) => account.account),
        ],
      });
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await store.setAllAccounts(data);
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    setIsAllowed(
      !paused && accountRoles.isWhitelistManager() && !isActiveAccountChangeTx,
    );
  }, [paused, isMounted, accountRoles, isActiveAccountChangeTx]);

  return { submit, isAllowed };
};
