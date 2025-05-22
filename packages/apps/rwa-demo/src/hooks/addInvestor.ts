import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import { registerIdentity } from '@/services/registerIdentity';
import { getClient } from '@/utils/client';
import { RWAStore } from '@/utils/store';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';

export const useAddInvestor = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const { paused } = useAsset();
  const { account, isOwner, sign, accountRoles, isMounted } = useAccount();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);
  const { organisation } = useOrganisation();
  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const submit = async (
    data: Omit<IRegisterIdentityProps, 'agent'>,
  ): Promise<ITransaction | undefined> => {
    const newData: IRegisterIdentityProps = {
      ...data,
      agent: account!,
    };
    try {
      //if the account is already investor, no need to add it again
      if (data.alreadyExists) return;

      const tx = await registerIdentity(newData);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.ADDINVESTOR,
        accounts: [account?.address!, data.accountName],
      });
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
    } finally {
      await store?.setAccount(data);
    }
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
  ]);

  return { submit, isAllowed };
};
