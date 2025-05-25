import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IForcedTransferTokensProps } from '@/services/forcedTransferTokens';
import { forcedTransferTokens } from '@/services/forcedTransferTokens';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
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
      addNotification({
        intent: 'negative',
        label: 'asset not found',
        message: '',
      });
      return;
    }

    try {
      const tx = await forcedTransferTokens(data, account!, asset);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

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
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    setIsAllowed(!paused && accountRoles.isTransferManager());
  }, [paused, isMounted, accountRoles, asset]);

  return { submit, isAllowed };
};
