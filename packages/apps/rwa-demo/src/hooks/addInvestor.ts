import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import { registerIdentity } from '@/services/registerIdentity';
import { getClient } from '@/utils/client';
import { store } from '@/utils/store';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useTransactions } from './transactions';

export const useAddInvestor = ({
  investorAccount,
}: {
  investorAccount?: string;
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const { paused } = useAsset();
  const { account, sign, accountRoles, isMounted } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (
    data: Omit<IRegisterIdentityProps, 'agent'>,
  ): Promise<ITransaction | undefined> => {
    const newData: IRegisterIdentityProps = { ...data, agent: account! };
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
      await store.setAccount(data);
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    setIsAllowed(
      ((!!investorAccount && !frozen) || frozen) &&
        !paused &&
        accountRoles.isWhitelistManager(),
    );
  }, [frozen, paused, isMounted, investorAccount, accountRoles]);

  return { submit, isAllowed };
};
