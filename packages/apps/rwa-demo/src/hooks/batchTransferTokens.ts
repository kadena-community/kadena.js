import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { ITransferToken } from '@/services/batchTransferTokens';
import { batchTransferTokens } from '@/services/batchTransferTokens';
import { getClient } from '@/utils/client';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useGetInvestorBalance } from './getInvestorBalance';
import { useTransactions } from './transactions';

export const useBatchTransferTokens = () => {
  const { account, sign, isMounted, isInvestor } = useAccount();
  const { data: balance } = useGetInvestorBalance({
    investorAccount: account?.address,
  });

  const { frozen } = useFreeze({ investorAccount: account?.address });
  const { asset, paused, investors, initFetchInvestors } = useAsset();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: ITransferToken[],
  ): Promise<ITransaction | undefined> => {
    if (!asset) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:batchtransfertokens`,
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
      const toAccounts = data.map((r) => r.to);
      const investorAccounts = investors.map((i) => i.accountName);
      const amountToBeTransferred = data.reduce(
        (acc, val) => acc + parseInt(val.amount),
        0,
      );

      if (balance < amountToBeTransferred) {
        addNotification({
          intent: 'negative',
          label: 'the Balance on the account is to low',
          message: `You are trying to transfer ${amountToBeTransferred} tokens and your balance is ${balance} tokens`,
        });

        return;
      }

      const nonExistingAccounts = toAccounts.filter(
        (account) => investorAccounts.indexOf(account) < 0,
      );

      if (nonExistingAccounts.length) {
        addNotification({
          intent: 'negative',
          label: 'Some of the accounts are not whitelisted',
          message: nonExistingAccounts.join(''),
        });

        return;
      }

      tx = await batchTransferTokens(data, account!, asset);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.TRANSFERTOKENS,
        accounts: [...data.map((v) => v.to).filter((v) => v), account!.address],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:batchtransfertokens`,
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
    initFetchInvestors();
  }, [isMounted, initFetchInvestors]);

  useEffect(() => {
    if (!isMounted) return;
    setIsAllowed(!frozen && !paused && isInvestor);
  }, [paused, isMounted, isInvestor, frozen, asset]);

  return { submit, isAllowed };
};
