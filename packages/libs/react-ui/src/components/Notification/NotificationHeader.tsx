import { headerContainerClass } from './Notification.css';

import React, { FC } from 'react';

export interface INotificationHeaderProps {
  children: React.ReactNode;
}

export const NotificationHeader: FC<INotificationHeaderProps> = ({
  children,
}) => {
  return <div className={headerContainerClass}>{children}</div>;
};
