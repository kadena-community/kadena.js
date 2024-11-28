import { interpretErrorMessage  } from '@/components/TransactionsProvider/TransactionsProvider';
import type {ITransaction} from '@/components/TransactionsProvider/TransactionsProvider';
import type { IAddAgentProps } from '@/services/addAgent';
import { addAgent } from '@/services/addAgent';
import type { ISetAddressFrozenProps } from '@/services/setAddressFrozen';
import { setAddressFrozen } from '@/services/setAddressFrozen';
import { getClient } from '@/utils/client';
import { useAccount } from './account';
import { useTransactions } from './transactions';
import { useNotifications } from '@kadena/kode-ui/patterns';

export const useFreezeInvestor = () => {
  const { account sign } = useAccount();
  const { addTransaction } = useTransactions();
  const {addNotification } = useNotifications();

  const submit = async (
    data: ISetAddressFrozenProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await setAddressFrozen(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: 'FREEZE-ADDRESS',
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
