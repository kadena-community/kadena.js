import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { IAddContractProps } from '@/services/createContract';
import { createContract } from '@/services/createContract';
import { createPrincipalNamespace } from '@/services/createPrincipalNamespace';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useCreateContract = () => {
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (
    data: IAddContractProps,
  ): Promise<ITransaction | undefined> => {
    // try {
    console.log(111);
    const tx = await createContract(data, account!);

    console.log({ tx, cmd: JSON.parse(tx.cmd) });

    const signedTransaction = await sign(tx);
    if (!signedTransaction) return;

    const client = getClient();
    const res = await client.submit(signedTransaction);

    console.log(res);

    const dataResult = await client.listen(res);

    return addTransaction({
      ...res,
      type: 'CREATEPRINCIPALNAMESPACE',
      result: dataResult.result,
    });
    // } catch (e: any) {
    //   addNotification({
    //     intent: 'negative',
    //     label: 'there was an error',
    //     message: interpretErrorMessage(e.message),
    //   });
    // }
  };

  return { submit };
};
