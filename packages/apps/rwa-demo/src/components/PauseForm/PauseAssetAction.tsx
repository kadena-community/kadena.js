import { useAsset } from '@/hooks/asset';
import { useTogglePause } from '@/hooks/togglePause';
import { useTransactions } from '@/hooks/transactions';
import { MonoPause, MonoPlayArrow } from '@kadena/kode-icons';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { AssetAction } from '../AssetAction/AssetAction';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { PauseForm } from './PauseForm';

export const PauseAssetAction: FC<{
  'data-testid'?: string;
}> = ({ 'data-testid': dataTestId }) => {
  const { paused } = useAsset();
  const [loading, setLoading] = useState(false);
  const { isAllowed } = useTogglePause();
  const { getTransactions } = useTransactions();
  const transactions = useMemo(() => {
    return getTransactions(TXTYPES.PAUSECONTRACT);
  }, [getTransactions]);

  const showIcon = () => {
    if (transactions.length) {
      return <TransactionTypeSpinner type={TXTYPES.PAUSECONTRACT} />;
    }
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
          data-testid={dataTestId}
          isDisabled={!isAllowed}
          icon={showIcon()}
          label={paused ? 'Contract is paused' : 'Contract is active'}
        />
      }
    />
  );
};
