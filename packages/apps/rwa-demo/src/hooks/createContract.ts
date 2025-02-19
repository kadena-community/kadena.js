import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { IAddContractProps } from '@/services/createContract';
import { createContract } from '@/services/createContract';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useTransactions } from './transactions';

export const useCreateContract = () => {
  const { account, isMounted, sign, isGasPayable } = useAccount();
  const [isAllowed, setIsAllowed] = useState(false);
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const submit = async (
    data: IAddContractProps,
  ): Promise<boolean | undefined> => {
    try {
      const tx = await createContract(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await addTransaction({
        ...res,
        type: TXTYPES.CREATECONTRACT,
        accounts: [account?.address!],
      });

      const dataResult = await client.listen(res);

      // if the contract already exists, go to that contract
      if (dataResult.result.status === 'failure') {
        if (
          (dataResult.result.error as any)?.message?.includes(
            '"PactDuplicateTableError',
          )
        ) {
          window.location.href = `/assets/create/${data.namespace}/${data.contractName}`;
          return false;
        }
        return false;
      }

      return true;
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
      return false;
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    setIsAllowed(isGasPayable);
  }, [isMounted, isGasPayable]);

  return { submit, isAllowed };
};
