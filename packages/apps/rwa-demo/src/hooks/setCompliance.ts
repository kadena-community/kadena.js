import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IComplianceRuleTypes } from '@/services/getComplianceRules';
import { setCompliance } from '@/services/setCompliance';
import type { ISetComplianceParametersProps } from '@/services/setComplianceParameters';
import { setComplianceParameters } from '@/services/setComplianceParameters';
import { getActiveRulesKeys } from '@/utils/getActiveRulesKeys';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useSetCompliance = () => {
  const { account, isOwner, isMounted, accountRoles } = useAccount();
  const { asset, paused } = useAsset();
  const { isActiveAccountChangeTx } = useTransactions();
  const [isAllowed, setIsAllowed] = useState(false);
  const { submit2Chain } = useSubmit2Chain();

  const toggleComplianceRule = async (
    ruleKey: IComplianceRuleTypes,
    newState: boolean,
  ) => {
    return submit2Chain(undefined, {
      notificationSentryName: 'error:submit:togglecompliancerule',
      successMessage: 'Toggle compliance rule successful',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        const rules = getActiveRulesKeys(asset.compliance, ruleKey, newState);

        return setCompliance(rules, account!, asset);
      },
      transaction: {
        type: TXTYPES.SETCOMPLIANCERULE,
        accounts: [account?.address!],
      },
    });
  };

  const submit = async (data: ISetComplianceParametersProps) => {
    return submit2Chain<ISetComplianceParametersProps>(data, {
      notificationSentryName: 'error:submit:setcompliance',
      successMessage: 'Set compliance parameters successful',
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return setComplianceParameters(data, account!, asset);
      },
      transaction: {
        type: TXTYPES.SETCOMPLIANCE,
        accounts: [account?.address!],
      },
    });
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
    asset?.uuid,
  ]);

  return { submit, isAllowed, toggleComplianceRule };
};
