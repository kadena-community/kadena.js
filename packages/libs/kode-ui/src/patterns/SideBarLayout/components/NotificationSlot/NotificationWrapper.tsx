import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import type { INotificationMinimizedProps } from '../LayoutProvider/NotificationsProvider';
import { useNotifications } from '../LayoutProvider/NotificationsProvider';
import { Notification } from './../../../../components';

type IProps = PropsWithChildren & INotificationMinimizedProps;

export const NotificationWrapper: FC<IProps> = ({ children, ...props }) => {
  const { removeNotification } = useNotifications();

  useEffect(() => {
    if (!props.isDismissable) {
      setTimeout(() => {
        removeNotification(props);
      }, 12000);
    }
  }, []);

  return <Notification {...props}>{children}</Notification>;
};
