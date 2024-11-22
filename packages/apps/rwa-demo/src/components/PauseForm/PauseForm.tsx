import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useTransactions } from '@/hooks/transactions';
import { togglePause } from '@/services/togglePause';
import { getClient } from '@/utils/client';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';

export const PauseForm: FC = () => {
  const { paused } = useAsset();
  const { account, sign } = useAccount();
  const { addTransaction } = useTransactions();

  const handlePauseToggle = async () => {
    try {
      const tx = await togglePause(paused, account!);
      const signedTransaction = await sign(tx);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);

      const transaction = addTransaction({
        ...res,
        type: 'PAUSE',
        data: { ...res },
      });

      await transaction.listener;
    } catch (e: any) {}
  };

  console.log({ paused });
  return (
    <Button
      onPress={handlePauseToggle}
      startVisual={paused ? <MonoPause /> : <MonoPlayArrow />}
    >
      {paused ? 'paused' : 'active'}
    </Button>
  );
};
