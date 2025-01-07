import { INFINITE_COMPLIANCE } from '@/constants';
import { useAsset } from '@/hooks/asset';
import { Notification } from '@kadena/kode-ui';
import type { FC } from 'react';

export const MaxSupplyMessage: FC = () => {
  const { asset } = useAsset();

  if (!asset) return;
  const isMaxReached =
    asset.maxSupply <= asset.supply && asset.maxSupply > INFINITE_COMPLIANCE;
  if (!isMaxReached) return;

  return (
    <Notification intent="info" role="status">
      The max Supply for this contract is reached ({asset.maxSupply} tokens)
    </Notification>
  );
};
