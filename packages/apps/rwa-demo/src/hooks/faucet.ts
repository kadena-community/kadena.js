import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import { faucet } from '@/services/faucet';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useNetwork } from './networks';
import { useTransactions } from './transactions';

export const useFaucet = () => {
  const { account, sign, isMounted, isGasPayable } = useAccount();
  const { addTransaction } = useTransactions();
  const { activeNetwork } = useNetwork();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (): Promise<ITransaction | undefined> => {
    try {
      if (!account) return;
      const tx = await faucet(account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.FAUCET,
        accounts: [account?.address],
      });
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    }
  };

  useEffect(() => {
    if (!isMounted || activeNetwork.networkId !== 'development') return;

    setIsAllowed(!!account?.address && !isGasPayable);
  }, [account?.address, isMounted, isGasPayable]);

  return { submit, isAllowed };
};
