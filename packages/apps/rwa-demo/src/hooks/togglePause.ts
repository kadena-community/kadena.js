import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { ITogglePauseProps } from '@/services/togglePause';
import { togglePause } from '@/services/togglePause';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useTogglePause = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (
    data: ITogglePauseProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await togglePause(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: 'PAUSE',
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
