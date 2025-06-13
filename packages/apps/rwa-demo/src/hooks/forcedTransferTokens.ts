import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IForcedTransferTokensProps } from '@/services/forcedTransferTokens';
import { forcedTransferTokens } from '@/services/forcedTransferTokens';
import { getClient } from '@/utils/client';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useForcedTransferTokens = () => {
  const { account, sign, isMounted, accountRoles } = useAccount();
  const { asset, paused } = useAsset();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (data: IForcedTransferTokensProps) => {
    if (!asset) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:forcedtransfertokens`,
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
      tx = await forcedTransferTokens(data, account!, asset);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.TRANSFERTOKENS,
        accounts: [
          account?.address!,
          data.investorFromAccount!,
          data.investorToAccount,
        ],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:forcedtransfertokens`,
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
    setIsAllowed(!paused && accountRoles.isTransferManager());
  }, [paused, isMounted, accountRoles, asset]);

  return { submit, isAllowed };
};
