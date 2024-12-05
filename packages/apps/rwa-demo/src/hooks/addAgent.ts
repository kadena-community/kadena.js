import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { IAddAgentProps } from '@/services/addAgent';
import { addAgent } from '@/services/addAgent';
import { getClient } from '@/utils/client';
import { store } from '@/utils/store';
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
      //if the account is already agent, no need to add it again
      if (data.alreadyExists) return;

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
    } finally {
      await store.setAccount(data);
    }
  };

  return { submit };
};
