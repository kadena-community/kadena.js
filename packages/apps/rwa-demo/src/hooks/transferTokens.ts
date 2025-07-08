import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { ITransferTokensProps } from '@/services/transferTokens';
import { transferTokens } from '@/services/transferTokens';
import { maskValue } from '@kadena/kode-ui';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useTransferTokens = () => {
  const { account, isMounted, isInvestor } = useAccount();
  const { frozen } = useFreeze({ investorAccount: account?.address });
  const { asset, paused } = useAsset();
  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const submit = async (data: ITransferTokensProps) => {
    const accountStr = data.investorFromAccount
      ? data.investorFromAccount
      : account?.address!;

    return submit2Chain<ITransferTokensProps>(data, {
      notificationSentryName: 'error:submit:transfertokens',
      successMessage: `Transfer tokens from ${maskValue(accountStr)} to ${maskValue(data.investorToAccount)} successful`,
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return transferTokens(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.TRANSFERTOKENS,
        accounts: [accountStr, data.investorToAccount],
      },
    });
  };

  useEffect(() => {
    if (!isMounted) return;
    setIsAllowed(!frozen && !paused && isInvestor);
  }, [paused, isMounted, isInvestor, frozen, asset?.uuid]);

  return { submit, isAllowed };
};
