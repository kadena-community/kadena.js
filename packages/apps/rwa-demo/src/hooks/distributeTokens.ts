import { INFINITE_COMPLIANCE } from '@/constants';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IDistributeTokensProps } from '@/services/distributeTokens';
import { distributeTokens } from '@/services/distributeTokens';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useGetInvestorBalance } from './getInvestorBalance';
import { useTransactions } from './transactions';

export const useDistributeTokens = ({
  investorAccount,
}: {
  investorAccount: string;
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const { paused, asset, maxCompliance } = useAsset();

  const { account, sign, accountRoles, isMounted } = useAccount();
  const { data: investorBalance } = useGetInvestorBalance({ investorAccount });
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (data: IDistributeTokensProps) => {
    try {
      const tx = await distributeTokens(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.DISTRIBUTETOKENS,
        accounts: [investorAccount],
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
    if (!isMounted || !asset) return;

    const complianceMaxSupplyValue = maxCompliance('supply-limit-compliance');
    const complianceMaxInvestors = maxCompliance('max-investors-compliance');

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
  ]);

  return { submit, isAllowed };
};
