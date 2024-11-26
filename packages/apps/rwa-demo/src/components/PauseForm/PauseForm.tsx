import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useTransactions } from '@/hooks/transactions';
import { togglePause } from '@/services/togglePause';
import { getClient } from '@/utils/client';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

export const PauseForm: FC = () => {
  const { paused } = useAsset();
  const [loading, setLoading] = useState(false);
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();

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

      await transaction.listener;
    } catch (e: any) {}
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
    <Button onPress={handlePauseToggle} startVisual={showIcon()}>
      {paused ? 'paused' : 'active'}
    </Button>
  );
};
