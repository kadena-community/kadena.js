import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import { registerIdentity } from '@/services/registerIdentity';
import { RWAStore } from '@/utils/store';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';
import { useSubmit2Chain } from './useSubmit2Chain';

export const useAddInvestor = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const { asset, paused } = useAsset();
  const { account, isOwner, accountRoles, isMounted } = useAccount();
  const { isActiveAccountChangeTx } = useTransactions();
  const [isAllowed, setIsAllowed] = useState(false);
  const { organisation } = useOrganisation();
  const { submit2Chain } = useSubmit2Chain();
  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const submit = async (
    data: Omit<IRegisterIdentityProps, 'agent'>,
  ): Promise<ITransaction | undefined> => {
    const tx = await submit2Chain<Omit<IRegisterIdentityProps, 'agent'>>(data, {
      notificationSentryName: 'error:submit:addinvestor',
      successMessage: `Investor ${data.accountName} has been added successfully.`,
      chainFunction: (account: IWalletAccount, asset: IAsset) => {
        if (data.alreadyExists) return Promise.resolve(undefined);

        const newData: IRegisterIdentityProps = {
          ...data,
          agent: account!,
        };

        return registerIdentity(newData, asset);
      },
      transaction: {
        type: TXTYPES.ADDINVESTOR,
        accounts: [account?.address!, data.accountName],
      },
    });

    await store?.setAccount(data);
    return tx;
  };

  useEffect(() => {
    if (!isMounted) return;

    //when there is no investor account, we dont have to look if frozen or not
    setIsAllowed(
      ((!!investorAccount && !frozen) || !investorAccount) &&
        !paused &&
        (accountRoles.isAgentAdmin() || isOwner) &&
        !isActiveAccountChangeTx,
    );
  }, [
    frozen,
    paused,
    isMounted,
    investorAccount,
    isOwner,
    accountRoles,
    isActiveAccountChangeTx,
    asset?.uuid,
  ]);

  return { submit, isAllowed };
};
