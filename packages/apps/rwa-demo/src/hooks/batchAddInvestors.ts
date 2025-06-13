import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IBatchRegisterIdentityProps } from '@/services/batchRegisterIdentity';
import { batchRegisterIdentity } from '@/services/batchRegisterIdentity';
import { getClient } from '@/utils/client';
import { RWAStore } from '@/utils/store';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';

export const useBatchAddInvestors = () => {
  const { asset, paused } = useAsset();
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
    data: Omit<IBatchRegisterIdentityProps, 'agent'>,
  ): Promise<ITransaction | undefined> => {
    if (!asset) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:batchaddinvestor`,
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

    const newData: IBatchRegisterIdentityProps = { ...data, agent: account! };
    let res: ITransactionDescriptor | undefined = undefined;
    let tx: IUnsignedCommand | undefined = undefined;
    try {
      tx = await batchRegisterIdentity(newData, asset);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.ADDINVESTOR,
        accounts: [
          account?.address!,
          ...data.accounts.map((account) => account.account),
        ],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:batchaddinvestor`,
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
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await store?.setAllAccounts(data);
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
    isOwner,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
    asset,
  ]);

  return { submit, isAllowed };
};
