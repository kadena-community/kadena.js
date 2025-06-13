import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { ITogglePauseProps } from '@/services/togglePause';
import { togglePause } from '@/services/togglePause';
import { getClient } from '@/utils/client';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useTogglePause = () => {
  const { asset } = useAsset();
  const { account, sign, isMounted, accountRoles } = useAccount();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: ITogglePauseProps,
  ): Promise<ITransaction | undefined> => {
    if (!asset) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:togglepause`,
          options: {
            message: 'asset not found',
            sentryData: {
              type: 'submit_chain',
            },
          },
        },
      );

      return;
    }

    let res: ITransactionDescriptor | undefined = undefined;
    let tx: IUnsignedCommand | undefined = undefined;
    try {
      tx = await togglePause(data, account!, asset);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.PAUSECONTRACT,
        accounts: [account?.address!],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:togglepause`,
          options: {
            message: interpretErrorMessage(e.message),
            sentryData: {
              type: 'submit_chain',
              captureContext: {
                extra: {
                  tx,
                  data,
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
    if (!isMounted) return;
    setIsAllowed(accountRoles.isFreezer() && !isActiveAccountChangeTx);
  }, [
    account?.address,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
    asset,
  ]);

  return { submit, isAllowed };
};
