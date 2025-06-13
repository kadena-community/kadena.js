import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IAddAgentProps } from '@/services/addAgent';
import { addAgent } from '@/services/addAgent';
import { editAgent } from '@/services/editAgent';
import { getClient } from '@/utils/client';
import { RWAStore } from '@/utils/store';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';

export const useEditAgent = () => {
  const { account, sign, isMounted, accountRoles, isOwner } = useAccount();
  const { asset, paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);
  const { organisation } = useOrganisation();
  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const submit = async (
    data: IAddAgentProps,
  ): Promise<ITransaction | undefined> => {
    if (!asset) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:editagent`,
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
      tx = data.alreadyExists
        ? await editAgent(data, account!, asset)
        : await addAgent(data, account!, asset);

      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.ADDAGENT,
        accounts: [data.accountName],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:editagent`,
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
      await store?.setAccount(data);
    }
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
    asset,
  ]);

  return { submit, isAllowed };
};
