import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import { INFINITE_COMPLIANCE } from '@/constants';
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
  const { paused, asset } = useAsset();

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
    setIsAllowed(
      !frozen &&
        !paused &&
        accountRoles.isTransferManager() &&
        !isActiveAccountChangeTx &&
        ((asset.maxSupply.value > INFINITE_COMPLIANCE &&
          asset.supply < asset.maxSupply.value) ||
          asset.maxSupply.value === INFINITE_COMPLIANCE) &&
        ((asset.maxInvestors.value > INFINITE_COMPLIANCE &&
          asset.maxInvestors.value > asset.investorCount) ||
          asset.maxInvestors.value === INFINITE_COMPLIANCE ||
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
