import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import { registerIdentity } from '@/services/registerIdentity';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useAddInvestor = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (
    data: IRegisterIdentityProps,
  ): Promise<ITransaction | undefined> => {
    const newData: IRegisterIdentityProps = { ...data, agent: account! };
    try {
      const tx = await registerIdentity(newData);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);
      console.log(res);

      return addTransaction({
        ...res,
        type: 'IDENTITY-REGISTERED',
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
