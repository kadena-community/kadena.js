import { footerClass } from './Notification.css';

import React, { FC } from 'react';

export interface INotificationFooterProps {
  children: React.ReactNode;
}

export const NotificationFooter: FC<INotificationFooterProps> = ({
  children,
}) => <div className={footerClass}>{children}</div>;
