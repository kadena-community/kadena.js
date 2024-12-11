import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { ISetComplianceProps } from '@/services/setCompliance';
import { setCompliance } from '@/services/setCompliance';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useSetCompliance = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (data: ISetComplianceProps) => {
    try {
      const tx = await setCompliance(data, account!);
      console.log({ tx });

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
