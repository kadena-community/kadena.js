import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { ITransferToken } from '@/services/batchTransferTokens';
import { batchTransferTokens } from '@/services/batchTransferTokens';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useGetInvestorBalance } from './getInvestorBalance';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useBatchTransferTokens = () => {
  const { account, isMounted, isInvestor } = useAccount();
  const { data: balance } = useGetInvestorBalance({
    investorAccount: account?.address,
  });

  const { frozen } = useFreeze({ investorAccount: account?.address });
  const { asset, paused, investors, initFetchInvestors } = useAsset();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const dataNotValid = (data: ITransferToken[]): boolean => {
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

      return false;
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

      return false;
    }
    return true;
  };

  const submit = async (
    data: ITransferToken[],
  ): Promise<ITransaction | undefined> => {
    if (!dataNotValid(data)) return;

    return submit2Chain<ITransferToken[]>(data, {
      notificationSentryName: 'error:submit:batchtransfertokens',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return batchTransferTokens(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.TRANSFERTOKENS,
        accounts: [...data.map((v) => v.to).filter((v) => v), account!.address],
      },
    });
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
