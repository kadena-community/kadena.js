import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import type { INotificationMinimizedProps } from '../NotificationsProvider/NotificationsProvider';
import { useNotifications } from '../NotificationsProvider/NotificationsProvider';
import { Notification } from './../../../../components';

type IProps = PropsWithChildren & INotificationMinimizedProps;

export const NotificationWrapper: FC<IProps> = ({ children, ...props }) => {
  const { removeNotification } = useNotifications();

  useEffect(() => {
    if (!props.isDismissable) {
      setTimeout(() => {
        removeNotification(props);
      }, 6000);
    }
  }, []);

  return <Notification {...props}>{children}</Notification>;
};
