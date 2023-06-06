import { Notification, SystemIcons } from '@kadena/react-components';
import { NotificationBody } from '@kadena/react-components/types/components/Notification';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const MDNotification: FC<IProps> = ({ children, ...props }) => {
  console.log({ children, props });
  return (
    <div {...props}>
      <Notification title="test" expand icon={SystemIcons.Account}>
        <Notification.Body>{children}</Notification.Body>
      </Notification>
    </div>
  );
};
