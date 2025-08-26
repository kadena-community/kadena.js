import { Notification, NotificationHeading } from '@kadena/kode-ui';
import type { FC } from 'react';

export const DemoBanner: FC = () => {
  return (
    <Notification
      role="status"
      type="inlineStacked"
      intent="info"
      contentMaxWidth={1000}
    >
      <NotificationHeading>
        This is a demo app. And is not running on Mainnet
      </NotificationHeading>
    </Notification>
  );
};
