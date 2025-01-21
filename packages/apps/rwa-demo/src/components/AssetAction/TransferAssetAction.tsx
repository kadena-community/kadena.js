import { useTransferTokens } from '@/hooks/transferTokens';
import { MonoAdd } from '@kadena/kode-icons';
import type { ITileProps } from '@kadena/kode-ui';
import type { FC } from 'react';
import { AssetAction } from './AssetAction';

interface IProps {
  onPress?: ITileProps['onClick'];
}

export const TransferAssetAction: FC<IProps> = ({ onPress }) => {
  const { isAllowed: isTransferTokensAllowed } = useTransferTokens();
  return (
    <AssetAction
      onPress={onPress}
      isDisabled={!isTransferTokensAllowed}
      icon={<MonoAdd />}
      label="Transfer tokens"
    />
  );
};
