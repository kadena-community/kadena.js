import {
  interpretErrorMessage,
  TXTYPES,
} from '@/components/TransactionsProvider/TransactionsProvider';
import type { ITransferTokensProps } from '@/services/transferTokens';
import { transferTokens } from '@/services/transferTokens';
import { getClient } from '@/utils/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { useAccount } from './account';
import { useAsset } from './asset';
import { useFreeze } from './freeze';
import { useTransactions } from './transactions';

export const useBatchTransferTokens = () => {
  const { account, sign, isMounted, isInvestor } = useAccount();
  const { frozen } = useFreeze({ investorAccount: account?.address });
  const { paused } = useAsset();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();
  const [isAllowed, setIsAllowed] = useState(false);

  const submit = async (data: ITransferTokensProps) => {
    try {
      const tx = await transferTokens(data, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      return addTransaction({
        ...res,
        type: TXTYPES.TRANSFERTOKENS,
        accounts: [data.investorFromAccount, data.investorToAccount],
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
    setIsAllowed(!frozen && !paused && isInvestor);
  }, [paused, isMounted, isInvestor, frozen]);

  return { submit, isAllowed };
};
