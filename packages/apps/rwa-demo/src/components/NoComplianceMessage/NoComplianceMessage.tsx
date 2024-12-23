import { useAsset } from '@/hooks/asset';
import { Notification } from '@kadena/kode-ui';
import type { FC } from 'react';

export const NoComplianceMessage: FC = () => {
  const { asset } = useAsset();

  if (
    (asset?.maxSupply ?? -1) >= 0 &&
    (asset?.maxBalance ?? -1) >= 0 &&
    (asset?.maxInvestors ?? -1) >= 0
  )
    return;
  return (
    <Notification intent="info" role="status">
      There are no compliance rules set
    </Notification>
  );
};
