import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IDeleteIdentityProps } from '@/services/deleteIdentity';
import { deleteIdentity } from '@/services/deleteIdentity';
import { getClient } from '@/utils/client';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
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
  const { account, isOwner, sign, accountRoles, isMounted } = useAccount();
  const { data: balance } = useGetInvestorBalance({ investorAccount });
  const { asset, paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);
  const [notAllowedReason, setNotAllowedReason] = useState('');

  const submit = async (
    data: IDeleteIdentityProps,
  ): Promise<ITransaction | undefined> => {
    if (!asset) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:deleteinvestor`,
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
      tx = await deleteIdentity(data, account!, asset);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.DELETEINVESTOR,
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
          name: `error:submit:deleteinvestor`,
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

    //if the investorAccount is given, we are checking that we are allowed to remove THIS investor
    //when there is a balance of tokens on this investor,we are not allowed to remove it
    if (investorAccount) {
      const result =
        !paused &&
        (accountRoles.isAgentAdmin() || isOwner) &&
        !isActiveAccountChangeTx &&
        balance !== undefined &&
        balance <= 0;

      setIsAllowed(result);
      if (!result) {
        setNotAllowedReason(
          `There is still a balance of ${balance} tokens on this account`,
        );
      }
    }
  }, [
    paused,
    isOwner,
    account?.address,
    isMounted,
    balance,
    isActiveAccountChangeTx,
    asset,
  ]);

  return { submit, isAllowed, notAllowedReason };
};
