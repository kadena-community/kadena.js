import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IAddAgentProps } from '@/services/addAgent';
import { addAgent } from '@/services/addAgent';
import { editAgent } from '@/services/editAgent';
import { RWAStore } from '@/utils/store';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useEditAgent = () => {
  const { account, isMounted, accountRoles, isOwner } = useAccount();
  const { asset, paused } = useAsset();
  const { isActiveAccountChangeTx } = useTransactions();
  const [isAllowed, setIsAllowed] = useState(false);
  const { organisation } = useOrganisation();
  const { submit2Chain } = useSubmit2Chain();

  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const submit = async (
    data: IAddAgentProps,
  ): Promise<ITransaction | undefined> => {
    const tx = await submit2Chain<IAddAgentProps>(data, {
      notificationSentryName: 'error:submit:editagent',
      successMessage: data.alreadyExists
        ? `Edit agent ${data.accountName} successful`
        : `Add agent ${data.accountName} successful`,
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        return data.alreadyExists
          ? editAgent(data, account, asset)
          : addAgent(data, account, asset);
      },
      transaction: {
        accounts: [data.accountName, account?.address!],
        type: TXTYPES.ADDAGENT,
      },
    });

    await store?.setAccount(data);

    return tx;
  };

  useEffect(() => {
    if (!isMounted) return;
    setIsAllowed(
      !paused &&
        !isActiveAccountChangeTx &&
        (accountRoles.isAgentAdmin() || isOwner),
    );
  }, [
    paused,
    account?.address,
    isMounted,
    isOwner,
    accountRoles,
    isActiveAccountChangeTx,
    asset?.uuid,
  ]);

  return { submit, isAllowed };
};
