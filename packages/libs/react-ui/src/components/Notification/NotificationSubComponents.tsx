import type { ComponentPropsWithRef, FC } from 'react';
import React from 'react';
import { actionsContainerClass, titleClass } from './Notification.css';

export interface INotificationHeadingProps
  extends ComponentPropsWithRef<'h5'> {}

export const NotificationHeading: FC<INotificationHeadingProps> = ({
  children,
  ...restProps
}) => (
  <h5 className={titleClass} {...restProps}>
    {children}
  </h5>
);

export interface INotificationFooterProps {
  children: React.ReactNode;
}

export const NotificationFooter: FC<INotificationFooterProps> = ({
  children,
}) => <div className={actionsContainerClass}>{children}</div>;
