import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { IDeleteIdentityProps } from '@/services/deleteIdentity';
import { deleteIdentity } from '@/services/deleteIdentity';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useDeleteInvestor = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (
    data: IDeleteIdentityProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await deleteIdentity(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await client.listen(res);
      console.log('DONE');

      return addTransaction({
        ...res,
        type: 'DELETEINVESTOR',
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
