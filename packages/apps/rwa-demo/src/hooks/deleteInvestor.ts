import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import type { IDeleteIdentityProps } from '@/services/deleteIdentity';
import { deleteIdentity } from '@/services/deleteIdentity';
import { getBalance } from '@/services/getBalance';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useDeleteInvestor = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const {
    account,
    sign,
    accountRoles,
    isMounted: isAccountMounted,
  } = useAccount();
  const { paused } = useAsset();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);
  const [notAllowedReason, setNotAllowedReason] = useState('');
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);

  const submit = async (
    data: IDeleteIdentityProps,
  ): Promise<ITransaction | undefined> => {
    try {
      const tx = await deleteIdentity(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      await client.listen(res);
      console.log('DONE');

      return addTransaction({
        ...res,
        type: 'DELETEINVESTOR',
      });
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    }
  };

  const init = async (account: IWalletAccount, investorAccount: string) => {
    if (!account || !investorAccount || isMounted) return;
    const res = await getBalance({ investorAccount, account: account! });

    if (typeof res === 'number') {
      setBalance(res);
    }
    setIsMounted(true);
  };

  useEffect(() => {
    if (!account || !investorAccount) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(account, investorAccount);
  }, [account?.address, investorAccount]);

  useEffect(() => {
    if (!isAccountMounted || !isMounted) return;

    //if the investorAccount is given, we are checking that we are allowed to remove THIS investor
    //when there is a balance of tokens on this investor,we are not allowed to remove it
    if (investorAccount) {
      const result =
        !paused &&
        accountRoles.isWhitelistManager() &&
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

    setIsAllowed(!paused && accountRoles.isWhitelistManager());
  }, [paused, account?.address, isMounted, balance]);

  return { submit, isAllowed, notAllowedReason };
};
