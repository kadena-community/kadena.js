import { Notification, NotificationHeading } from '@kadena/kode-ui';
import type { FC } from 'react';

export const DemoBanner: FC = () => {
  return (
    <Notification role="status" type="stacked" intent="info">
      <NotificationHeading>
        This is a demo app. And is not running on Mainnet
      </NotificationHeading>
    </Notification>
  );
};
