import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { ITransferToken } from '@/services/batchTransferTokens';
import { batchTransferTokens } from '@/services/batchTransferTokens';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useGetInvestors } from './getInvestors';
import { useTransactions } from './transactions';

export const useBatchTransferTokens = () => {
  const { account, sign, isMounted, isInvestor, balance } = useAccount();
  const { data: investors } = useGetInvestors();
  const { frozen } = useFreeze({ investorAccount: account?.address });
  const { paused } = useAsset();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: ITransferToken[],
  ): Promise<ITransaction | undefined> => {
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

      const tx = await batchTransferTokens(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.TRANSFERTOKENS,
        accounts: [...data.map((v) => v.to).filter((v) => v), account!.address],
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
    setIsAllowed(!frozen && !paused && isInvestor);
  }, [paused, isMounted, isInvestor, frozen]);

  return { submit, isAllowed };
};
