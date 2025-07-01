import { INFINITE_COMPLIANCE } from '@/constants';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IDistributeTokensProps } from '@/services/distributeTokens';
import { distributeTokens } from '@/services/distributeTokens';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useGetInvestorBalance } from './getInvestorBalance';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useDistributeTokens = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const { paused, asset, maxCompliance } = useAsset();

  const { account, accountRoles, isMounted } = useAccount();
  const { data: investorBalance } = useGetInvestorBalance({ investorAccount });
  const { isActiveAccountChangeTx } = useTransactions();
  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const submit = async (data: IDistributeTokensProps) => {
    if (!investorAccount) {
      throw new Error('Investor account is not set');
    }
    return submit2Chain<IDistributeTokensProps>(data, {
      notificationSentryName: 'error:submit:distributetokens',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return distributeTokens(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.DISTRIBUTETOKENS,
        accounts: [investorAccount],
      },
    });
  };

  useEffect(() => {
    if (!isMounted || !asset) return;

    const complianceMaxSupplyValue = maxCompliance(
      'supply-limit-compliance-v1',
    );
    const complianceMaxInvestors = maxCompliance('max-investors-compliance-v1');
    setIsAllowed(
      !frozen &&
        !paused &&
        accountRoles.isTransferManager() &&
        !isActiveAccountChangeTx &&
        (asset.supply < complianceMaxSupplyValue ||
          complianceMaxSupplyValue === INFINITE_COMPLIANCE) &&
        (complianceMaxInvestors > asset.investorCount ||
          complianceMaxInvestors === INFINITE_COMPLIANCE ||
          investorBalance > 0),
    );
  }, [
    frozen,
    paused,
    account?.address,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
    asset,
    investorBalance,
    asset,
  ]);

  return { submit, isAllowed };
};
