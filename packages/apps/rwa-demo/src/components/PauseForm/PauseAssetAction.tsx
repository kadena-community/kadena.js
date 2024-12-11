import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import { useState } from 'react';
import { AssetAction } from '../AssetAction/AssetAction';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { PauseForm } from './PauseForm';

export const PauseAssetAction = () => {
  const { paused } = useAsset();
  const { isAgent } = useAccount();
  const [loading, setLoading] = useState(false);

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
          isDisabled={!isAgent}
          icon={showIcon()}
          label={paused ? 'Contract is paused' : 'Contract is active'}
        />
      }
    />
  );
};
