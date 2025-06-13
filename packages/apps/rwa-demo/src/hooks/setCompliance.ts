import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IComplianceRuleTypes } from '@/services/getComplianceRules';
import { setCompliance } from '@/services/setCompliance';
import type { ISetComplianceParametersProps } from '@/services/setComplianceParameters';
import { setComplianceParameters } from '@/services/setComplianceParameters';
import { getClient } from '@/utils/client';
import { getActiveRulesKeys } from '@/utils/getActiveRulesKeys';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';

export const useSetCompliance = () => {
  const { account, isOwner, sign, isMounted, accountRoles } = useAccount();
  const { asset, paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const toggleComplianceRule = async (
    ruleKey: IComplianceRuleTypes,
    newState: boolean,
  ) => {
    if (!asset) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:togglecompliancerule`,
          options: {
            message: 'asset not found',
            sentryData: {
              type: 'submit_chain',
            },
          },
        },
      );
      return;
    }
    const rules = getActiveRulesKeys(asset.compliance, ruleKey, newState);

    let res: ITransactionDescriptor | undefined = undefined;
    let tx: IUnsignedCommand | undefined = undefined;
    try {
      tx = await setCompliance(rules, account!, asset);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.SETCOMPLIANCERULE,
        accounts: [account?.address!],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:togglecompliancerule`,
          options: {
            message: interpretErrorMessage(e.message),
            sentryData: {
              type: 'submit_chain',
              captureContext: {
                extra: {
                  tx,
                  ruleKey,
                  newState,
                  res,
                },
              },
            },
          },
        },
      );
    }
  };

  const submit = async (data: ISetComplianceParametersProps) => {
    if (!asset) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:setcompliance`,
          options: {
            message: 'asset not found',
            sentryData: {
              type: 'submit_chain',
            },
          },
        },
      );
      return;
    }

    let res: ITransactionDescriptor | undefined = undefined;
    let tx: IUnsignedCommand | undefined = undefined;
    try {
      tx = await setComplianceParameters(data, account!, asset);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.SETCOMPLIANCE,
        accounts: [account?.address!],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:setcompliance`,
          options: {
            message: interpretErrorMessage(e.message),
            sentryData: {
              type: 'submit_chain',
              captureContext: {
                extra: {
                  tx,
                  data,
                  res,
                },
              },
            },
          },
        },
      );
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    setIsAllowed(
      !paused &&
        (accountRoles.isAgentAdmin() || isOwner) &&
        !isActiveAccountChangeTx,
    );
  }, [
    paused,
    account?.address,
    isMounted,
    accountRoles,
    isOwner,
    isActiveAccountChangeTx,
    asset,
  ]);

  return { submit, isAllowed, toggleComplianceRule };
};
