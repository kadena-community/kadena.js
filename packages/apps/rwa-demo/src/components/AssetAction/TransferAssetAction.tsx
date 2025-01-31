import { useTransferTokens } from '@/hooks/transferTokens';
import { MonoAdd } from '@kadena/kode-icons';
import type { ITileProps } from '@kadena/kode-ui';
import type { FC } from 'react';
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
      icon={<MonoAdd />}
      label="Transfer tokens"
    />
  );
};
