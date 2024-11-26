import { useAsset } from '@/hooks/asset';
import { Notification } from '@kadena/kode-ui';
import type { FC } from 'react';

export const AssetPausedMessage: FC = () => {
  const { paused } = useAsset();

  if (!paused) return;
  return (
    <Notification intent="info" role="status">
      The asset is on pause
    </Notification>
  );
};
