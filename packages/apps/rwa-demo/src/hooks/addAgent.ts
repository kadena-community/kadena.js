import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { IAddAgentProps } from '@/services/addAgent';
import { addAgent } from '@/services/addAgent';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useAddAgent = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (
    data: IAddAgentProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await addAgent(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: 'ADDAGENT',
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
