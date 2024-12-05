import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { ISetMaxSupplyProps } from '@/services/setMaxSupply';
import { setMaxSupply } from '@/services/setMaxSupply';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useSetMaxSupply = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (data: ISetMaxSupplyProps) => {
    try {
      const tx = await setMaxSupply(data, account!);

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
