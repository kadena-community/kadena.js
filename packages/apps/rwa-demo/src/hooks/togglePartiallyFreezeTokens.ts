import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { ITogglePartiallyFreezeTokensProps } from '@/services/togglePartiallyFreezeTokens';
import { togglePartiallyFreezeTokens } from '@/services/togglePartiallyFreezeTokens';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useTogglePartiallyFreezeTokens = ({
  investorAccount,
}: {
  investorAccount: string;
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const { asset, paused } = useAsset();
  const { account, accountRoles, isMounted } = useAccount();
  const { isActiveAccountChangeTx } = useTransactions();

  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const submit = async (data: ITogglePartiallyFreezeTokensProps) => {
    return await submit2Chain<ITogglePartiallyFreezeTokensProps>(data, {
      notificationSentryName: 'error:submit:togglePartiallyFreezeTokens',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return togglePartiallyFreezeTokens(data, account!, asset);
      },
      transaction: {
        type: data.freeze ? TXTYPES.TOKENSFROZEN : TXTYPES.TOKENSUNFROZEN,
        accounts: [data.investorAccount],
      },
    });
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
    asset?.uuid,
  ]);

  return { submit, isAllowed };
};
