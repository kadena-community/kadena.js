import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { IComplianceRuleTypes } from '@/services/getComplianceRules';
import { setCompliance } from '@/services/setCompliance';
import type { ISetComplianceParametersProps } from '@/services/setComplianceParameters';
import { setComplianceParameters } from '@/services/setComplianceParameters';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useSetCompliance = () => {
  const { account, sign, isMounted, accountRoles } = useAccount();
  const { paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const toggleComplianceRule = async (
    ruleKey: IComplianceRuleTypes,
    newState: boolean,
  ) => {
    try {
      const tx = await setCompliance(
        {
          newState,
          ruleKey,
        },
        account!,
      );

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.SETCOMPLIANCE,
        accounts: [account?.address!],
      });
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    }
  };

  const submit = async (data: ISetComplianceParametersProps) => {
    try {
      const tx = await setComplianceParameters(data, account!);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.SETCOMPLIANCE,
        accounts: [account?.address!],
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
    if (!isMounted) return;
    setIsAllowed(
      !paused && accountRoles.isAgentAdmin() && !isActiveAccountChangeTx,
    );
  }, [
    paused,
    account?.address,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
  ]);

  return { submit, isAllowed, toggleComplianceRule };
};
