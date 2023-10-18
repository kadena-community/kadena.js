import type { FC } from 'react';
import React from 'react';
import { actionsContainerClass } from './Notification.css';

export interface INotificationActionsProps {
  children: React.ReactNode;
}

export const NotificationActions: FC<INotificationActionsProps> = ({
  children,
}) => <div className={actionsContainerClass}>{children}</div>;
