import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { IDeleteIdentityProps } from '@/services/deleteIdentity';
import { deleteIdentity } from '@/services/deleteIdentity';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useGetInvestorBalance } from './getInvestorBalance';
import { useTransactions } from './transactions';

export const useDeleteInvestor = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  useGetInvestorBalance;
  const { account, sign, accountRoles, isMounted } = useAccount();
  const { data: balance } = useGetInvestorBalance({ investorAccount });
  const { paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);
  const [notAllowedReason, setNotAllowedReason] = useState('');

  const submit = async (
    data: IDeleteIdentityProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await deleteIdentity(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.DELETEINVESTOR,
        accounts: [account?.address!],
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

    //if the investorAccount is given, we are checking that we are allowed to remove THIS investor
    //when there is a balance of tokens on this investor,we are not allowed to remove it
    if (investorAccount) {
      const result =
        !paused &&
        accountRoles.isAgentAdmin() &&
        balance !== undefined &&
        balance <= 0;

      setIsAllowed(result);
      if (!result) {
        setNotAllowedReason(
          `There is still a balance of ${balance} tokens on this account`,
        );
      }
      return;
    }

    setIsAllowed(
      !paused && accountRoles.isAgentAdmin() && !isActiveAccountChangeTx,
    );
  }, [paused, account?.address, isMounted, balance, isActiveAccountChangeTx]);

  return { submit, isAllowed, notAllowedReason };
};
