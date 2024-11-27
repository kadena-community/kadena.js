import { interpretErrorMessage } from '@/components/TransactionsProvider/TransactionsProvider';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useTransactions } from '@/hooks/transactions';
import { togglePause } from '@/services/togglePause';
import { getClient } from '@/utils/client';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

export const PauseForm: FC = () => {
  const { paused } = useAsset();
  const [loading, setLoading] = useState(false);
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const handlePauseToggle = async () => {
    try {
      setLoading(true);
      const tx = await togglePause(paused, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      const transaction = await addTransaction({
        ...res,
        type: 'PAUSE',
      });

      return transaction;
    } catch (e: any) {
      addNotification({
        intent: 'negative',
        label: 'there was an error',
        message: interpretErrorMessage(e.message),
      });
      setLoading(false);
    }
  };

  const showIcon = () => {
    if (loading) {
      return <TransactionPendingIcon />;
    }
    return paused ? <MonoPause /> : <MonoPlayArrow />;
  };

  useEffect(() => {
    setLoading(false);
  }, [paused]);

  return (
    <SendTransactionAnimation
      onPress={handlePauseToggle}
      trigger={
        <Button startVisual={showIcon()}>{paused ? 'paused' : 'active'}</Button>
      }
    ></SendTransactionAnimation>
  );
};
