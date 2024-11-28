import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import type { IAddAgentProps } from '@/services/addAgent';
import { addAgent } from '@/services/addAgent';
import { getClient } from '@/utils/client';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useAddAgent = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();

  const submit = async (
    data: IAddAgentProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await addAgent(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      const transaction = await addTransaction({
        ...res,
        type: 'ADDAGENT',
      });
      console.log('DONE');

      return transaction;
    } catch (e: any) {}
  };

  return { submit };
};
