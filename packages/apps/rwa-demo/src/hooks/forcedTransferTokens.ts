import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IForcedTransferTokensProps } from '@/services/forcedTransferTokens';
import { forcedTransferTokens } from '@/services/forcedTransferTokens';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useForcedTransferTokens = () => {
  const { account, isMounted, accountRoles } = useAccount();
  const { asset, paused } = useAsset();
  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const submit = async (data: IForcedTransferTokensProps) => {
    return submit2Chain<IForcedTransferTokensProps>(data, {
      notificationSentryName: 'error:submit:forcedtransfertokens',
      successMessage: 'Forced transfer tokens successful',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return forcedTransferTokens(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.TRANSFERTOKENS,
        accounts: [
          account?.address!,
          data.investorFromAccount!,
          data.investorToAccount,
        ],
      },
    });
  };

  useEffect(() => {
    if (!isMounted) return;
    setIsAllowed(!paused && accountRoles.isTransferManager());
  }, [paused, isMounted, accountRoles, asset?.uuid]);

  return { submit, isAllowed };
};
