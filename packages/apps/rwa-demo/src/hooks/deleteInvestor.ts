import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IDeleteIdentityProps } from '@/services/deleteIdentity';
import { deleteIdentity } from '@/services/deleteIdentity';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useGetInvestorBalance } from './getInvestorBalance';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useDeleteInvestor = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  useGetInvestorBalance;
  const { account, isOwner, accountRoles, isMounted } = useAccount();
  const { data: balance } = useGetInvestorBalance({ investorAccount });
  const { asset, paused } = useAsset();
  const { isActiveAccountChangeTx } = useTransactions();
  const [isAllowed, setIsAllowed] = useState(false);
  const [notAllowedReason, setNotAllowedReason] = useState('');
  const { submit2Chain } = useSubmit2Chain();

  const submit = async (
    data: IDeleteIdentityProps,
  ): Promise<ITransaction | undefined> => {
    return submit2Chain<IDeleteIdentityProps>(data, {
      notificationSentryName: 'error:submit:deleteinvestor',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return deleteIdentity(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.DELETEINVESTOR,
        accounts: [account?.address!],
      },
    });
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
    asset?.uuid,
  ]);

  return { submit, isAllowed, notAllowedReason };
};
