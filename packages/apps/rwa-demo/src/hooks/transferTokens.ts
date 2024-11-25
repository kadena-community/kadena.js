import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { ITransferTokensProps } from '@/services/transferTokens';
import { transferTokens } from '@/services/transferTokens';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useTransferTokens = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (data: ITransferTokensProps) => {
    try {
      const tx = await transferTokens(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      console.log(1111, res);

      addTransaction({
        ...res,
        type: 'TRANSFERTOKENS',
        data: { ...res },
      });

      console.log({ res });
      console.log('DONE');
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
