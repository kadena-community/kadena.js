import { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import { useTransferTokens } from '@/hooks/transferTokens';
import { MonoAdd } from '@kadena/kode-icons';
import type { ITileProps } from '@kadena/kode-ui';
import type { FC } from 'react';
import { TransactionTypeSpinner } from '../TransactionTypeSpinner/TransactionTypeSpinner';
import { AssetAction } from './AssetAction';

interface IProps {
  onPress?: ITileProps['onClick'];
  'data-testid'?: string;
}

export const TransferAssetAction: FC<IProps> = ({
  onPress,
  'data-testid': dataTestId,
}) => {
  const { isAllowed: isTransferTokensAllowed } = useTransferTokens();
  return (
    <AssetAction
      data-testid={dataTestId}
      onPress={onPress}
      isDisabled={!isTransferTokensAllowed}
      icon={
        <TransactionTypeSpinner
          type={TXTYPES.TRANSFERTOKENS}
          fallbackIcon={<MonoAdd />}
        />
      }
      label="Transfer tokens"
    />
  );
};
