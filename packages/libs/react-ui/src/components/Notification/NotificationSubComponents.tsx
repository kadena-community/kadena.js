import type { FC } from 'react';
import React from 'react';
import { actionsContainerClass, titleClass } from './Notification.css';

export interface IBaseProps {
  children: React.ReactNode;
}

export const NotificationHeading: FC<IBaseProps> = ({ children }) => (
  <span className={titleClass}>{children}</span>
);

export const NotificationActions: FC<IBaseProps> = ({ children }) => (
  <div className={actionsContainerClass}>{children}</div>
);
