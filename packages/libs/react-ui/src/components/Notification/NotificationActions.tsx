import { actionsContainerClass } from './Notification.css';

import React, { FC } from 'react';

export interface INotificationActionsProps {
  children: React.ReactNode;
}

export const NotificationActions: FC<INotificationActionsProps> = ({
  children,
}) => <div className={actionsContainerClass}>{children}</div>;
