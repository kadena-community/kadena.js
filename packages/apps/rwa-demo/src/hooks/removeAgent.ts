import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IRemoveAgentProps } from '@/services/removeAgent';
import { removeAgent } from '@/services/removeAgent';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useRemoveAgent = () => {
  const { account, sign, isOwner, isMounted } = useAccount();
  const { asset, paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: IRemoveAgentProps,
  ): Promise<ITransaction | undefined> => {
    if (!asset) {
      addNotification({
        intent: 'negative',
        label: 'asset not found',
        message: '',
      });
      return;
    }

    try {
      const tx = await removeAgent(data, account!, asset);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.REMOVEAGENT,
        accounts: [account?.address!, data.agent],
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

    setIsAllowed(!paused && !isActiveAccountChangeTx && isOwner);
  }, [
    paused,
    account?.address,
    isMounted,
    isActiveAccountChangeTx,
    isOwner,
    asset,
  ]);

  return { submit, isAllowed };
};
