import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IRemoveAgentProps } from '@/services/removeAgent';
import { removeAgent } from '@/services/removeAgent';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useRemoveAgent = () => {
  const { account, isOwner, isMounted } = useAccount();
  const { asset, paused } = useAsset();
  const { isActiveAccountChangeTx } = useTransactions();
  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const submit = async (
    data: IRemoveAgentProps,
  ): Promise<ITransaction | undefined> => {
    return submit2Chain<IRemoveAgentProps>(data, {
      notificationSentryName: 'error:submit:removeagent',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return removeAgent(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.REMOVEAGENT,
        accounts: [account?.address!, data.agent],
      },
    });
  };

  useEffect(() => {
    if (!isMounted) return;

    setIsAllowed(!paused && !isActiveAccountChangeTx && isOwner);
  }, [
    paused,
    account?.address,
    isMounted,
    isActiveAccountChangeTx,
    isOwner,
    asset,
  ]);

  return { submit, isAllowed };
};
