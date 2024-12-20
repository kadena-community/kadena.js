import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { ITogglePartiallyFreezeTokensProps } from '@/services/togglePartiallyFreezeTokens';
import { togglePartiallyFreezeTokens } from '@/services/togglePartiallyFreezeTokens';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useTransactions } from './transactions';

export const useTogglePartiallyFreezeTokens = ({
  investorAccount,
}: {
  investorAccount: string;
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const { paused } = useAsset();
  const { account, sign, accountRoles, isMounted } = useAccount();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (data: ITogglePartiallyFreezeTokensProps) => {
    try {
      const tx = await togglePartiallyFreezeTokens(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.PARTIALLYFREEZETOKENS,
        accounts: [data.investorAccount],
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
    setIsAllowed(
      !frozen &&
        !paused &&
        accountRoles.isFreezer() &&
        !isActiveAccountChangeTx,
    );
  }, [
    frozen,
    paused,
    account?.address,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
  ]);

  return { submit, isAllowed };
};
