import { useAsset } from '@/hooks/asset';
import { useTogglePause } from '@/hooks/togglePause';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { useState } from 'react';
import { AssetAction } from '../AssetAction/AssetAction';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { PauseForm } from './PauseForm';

export const PauseAssetAction = () => {
  const { paused } = useAsset();
  const [loading, setLoading] = useState(false);
  const { isAllowed } = useTogglePause();

  const showIcon = () => {
    if (loading) {
      return <TransactionPendingIcon />;
    }
    return paused ? <MonoPause /> : <MonoPlayArrow />;
  };

  return (
    <PauseForm
      handleSetIsLoading={setLoading}
      trigger={
        <AssetAction
          isDisabled={!isAllowed}
          icon={showIcon()}
          label={paused ? 'Contract is paused' : 'Contract is active'}
        />
      }
    />
  );
};
