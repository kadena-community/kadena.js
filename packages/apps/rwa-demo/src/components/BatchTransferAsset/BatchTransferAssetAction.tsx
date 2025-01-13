import { useBatchTransferTokens } from '@/hooks/batchTransferTokens';
import { MonoAdd } from '@kadena/kode-icons';
import type { ITileProps } from '@kadena/kode-ui';
import type { FC } from 'react';
import { AssetAction } from '../AssetAction/AssetAction';

interface IProps {
  onPress?: ITileProps['onClick'];
}

export const BatchTransferAssetAction: FC<IProps> = ({ onPress }) => {
  const { isAllowed: isTransferTokensAllowed } = useBatchTransferTokens();
  return (
    <AssetAction
      onPress={onPress}
      isDisabled={!isTransferTokensAllowed}
      icon={<MonoAdd />}
      label="Batch Transfer tokens"
    />
  );
};
