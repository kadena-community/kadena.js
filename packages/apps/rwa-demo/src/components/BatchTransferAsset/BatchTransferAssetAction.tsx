import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useBatchTransferTokens } from '@/hooks/batchTransferTokens';
import { MonoAdd } from '@kadena/kode-icons';
import type { ITileProps } from '@kadena/kode-ui';
import type { FC } from 'react';
import { AssetAction } from '../AssetAction/AssetAction';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { BatchTransferAssetForm } from './BatchTransferAssetForm';

interface IProps {
  onPress?: ITileProps['onClick'];
  'data-testid'?: string;
}

export const BatchTransferAssetAction: FC<IProps> = ({
  onPress,
  'data-testid': dataTestId,
}) => {
  const { isAllowed: isTransferTokensAllowed } = useBatchTransferTokens();
  return (
    <BatchTransferAssetForm
      trigger={
        <AssetAction
          data-testid={dataTestId}
          isDisabled={!isTransferTokensAllowed}
          icon={
            <TransactionTypeSpinner
              type={TXTYPES.TRANSFERTOKENS}
              fallbackIcon={<MonoAdd />}
            />
          }
          label="Batch Transfer tokens"
        />
      }
    />
  );
};
