import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useNotifications } from '@/hooks/notifications';
import { interpretErrorMessage } from '@/providers/TransactionsProvider/TransactionsProvider';
import type { IBatchSetAddressFrozenProps } from '@/services/batchSetAddressFrozen';
import { batchSetAddressFrozen } from '@/services/batchSetAddressFrozen';
import { getClient } from '@/utils/client';
import { RWAStore } from '@/utils/store';
import type { ITransactionDescriptor, IUnsignedCommand } from '@kadena/client';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useOrganisation } from './organisation';
import { useTransactions } from './transactions';
import { useUser } from './user';

export const useBatchFreezeInvestors = () => {
  const { asset } = useAsset();
  const { user } = useUser();
  const { account, sign, isMounted, accountRoles } = useAccount();
  const { paused } = useAsset();
  const { addTransaction, isActiveAccountChangeTx } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);
  const { organisation } = useOrganisation();
  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const submit = async (
    data: IBatchSetAddressFrozenProps,
  ): Promise<ITransaction | undefined> => {
    if (!asset || !user) {
      addNotification(
        {
          intent: 'negative',
          label: 'asset not found',
          message: '',
        },
        {
          name: `error:submit:batchfreezeinvestors`,
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
      tx = await batchSetAddressFrozen(data, account!, asset);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await store?.setFrozenMessages(data, user, asset);
      const signedTransaction = await sign(tx);

      if (!signedTransaction) return;

      const client = getClient();
      res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.FREEZEINVESTOR,
        accounts: [...data.investorAccounts, account!.address],
      });
    } catch (e: any) {
      addNotification(
        {
          intent: 'negative',
          label: 'there was an error',
          message: interpretErrorMessage(e.message),
        },
        {
          name: `error:submit:batchfreezeinvestors`,
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
      !paused && accountRoles.isFreezer() && !isActiveAccountChangeTx,
    );
  }, [
    paused,
    account?.address,
    isMounted,
    accountRoles,
    isActiveAccountChangeTx,
    asset,
  ]);

  return { submit, isAllowed };
};
