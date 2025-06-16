import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import { faucet } from '@/services/faucet';
import { getClient } from '@/utils/client';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
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
    let res: ITransactionDescriptor | undefined = undefined;
    let tx: IUnsignedCommand | undefined = undefined;
    try {
      if (!account) return;
      tx = await faucet(account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.FAUCET,
        accounts: [account?.address],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:faucet`,
          options: {
            message: interpretErrorMessage(e.message),
            sentryData: {
              type: 'submit_chain',
              captureContext: {
                extra: {
                  tx,
                  res,
                },
              },
            },
          },
        },
      );
    }
  };

  useEffect(() => {
    if (
      isGasPayable === undefined ||
      !isMounted ||
      (activeNetwork.networkId !== 'development' &&
        activeNetwork.networkId !== 'testnet04')
    )
      return;

    setIsAllowed(!!account?.address && !isGasPayable);
  }, [account?.address, isMounted, isGasPayable]);

  return { submit, isAllowed };
};
