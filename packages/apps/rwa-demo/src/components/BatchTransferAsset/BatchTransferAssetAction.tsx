import { useBatchTransferTokens } from '@/hooks/batchTransferTokens';
import { MonoAdd } from '@kadena/kode-icons';
import type { ITileProps } from '@kadena/kode-ui';
import type { FC } from 'react';
import { AssetAction } from '../AssetAction/AssetAction';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { TXTYPES } from '../TransactionsProvider/TransactionsProvider';
import { BatchTransferAssetForm } from './BatchTransferAssetForm';

interface IProps {
  onPress?: ITileProps['onClick'];
}

export const BatchTransferAssetAction: FC<IProps> = ({ onPress }) => {
  const { isAllowed: isTransferTokensAllowed } = useBatchTransferTokens();
  return (
    <BatchTransferAssetForm
      trigger={
        <AssetAction
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
