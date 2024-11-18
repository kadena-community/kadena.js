import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useNetwork } from '@/hooks/networks';
import { togglePause } from '@/services/togglePause';
import { getClient } from '@/utils/client';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';

export const PauseForm: FC = () => {
  const { isPaused } = useAsset();
  const { account, sign } = useAccount();
  const { activeNetwork } = useNetwork();

  const handlePauseToggle = async () => {
    try {
      const transaction = await togglePause(isPaused, activeNetwork, account!);

      const signedTransaction = await sign(transaction);
      if (!signedTransaction) return;

      const client = getClient();
      const res = await client.submit(signedTransaction);
      console.log(res);

      await client.listen(res);
      console.log('DONE');
    } catch (e: any) {}
  };

  return (
    <Button
      onPress={handlePauseToggle}
      startVisual={isPaused ? <MonoPause /> : <MonoPlayArrow />}
    >
      {isPaused ? 'paused' : 'active'}
    </Button>
  );
};
