import { useAsset } from '@/hooks/asset';
import { useTogglePause } from '@/hooks/togglePause';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { Button } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

export const PauseForm: FC = () => {
  const { paused } = useAsset();
  const [loading, setLoading] = useState(false);
  const { submit } = useTogglePause();

  const handlePauseToggle = async () => {
    try {
      setLoading(true);
      return await submit({ isPaused: paused });
    } catch (e: any) {
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
