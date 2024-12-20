import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { IRemoveAgentProps } from '@/services/removeAgent';
import { removeAgent } from '@/services/removeAgent';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useRemoveAgent = () => {
  const { account, sign, isMounted, accountRoles, isOwner } = useAccount();
  const { paused } = useAsset();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: IRemoveAgentProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await removeAgent(data, account!);

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
    setIsAllowed(!paused && (accountRoles.isAgentAdmin() || isOwner));
  }, [paused, account?.address, isMounted, isOwner]);

  return { submit, isAllowed };
};
