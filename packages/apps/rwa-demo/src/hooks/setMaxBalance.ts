import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { ISetMaxBalanceProps } from '@/services/setMaxBalance';
import { setMaxBalance } from '@/services/setMaxBalance';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useSetMaxBalance = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (data: ISetMaxBalanceProps) => {
    try {
      const tx = await setMaxBalance(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: 'SETMAXBALANCE',
      });
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    }
  };

  return { submit };
};
