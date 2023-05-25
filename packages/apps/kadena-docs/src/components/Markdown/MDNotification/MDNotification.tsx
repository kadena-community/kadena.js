import { Notification, SystemIcons } from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export const MDNotification: FC<IProps> = ({ children, ...props }) => {
  return (
    <div {...props}>
      <Notification
        title="test"
        description={children}
        icon={SystemIcons.Account}
      />
    </div>
  );
};
