import {
  INotificationActionsProps,
  NotificationActions,
} from './NotificationActions';
import {
  INotificationButtonProps,
  NotificationButton,
} from './NotificationButton';
import {
  INotificationProps,
  NotificationContainer,
} from './NotificationContainer';
import {
  INotificationHeaderProps,
  NotificationHeader,
} from './NotificationHeader';

import { FC } from 'react';

export {
  INotificationProps,
  INotificationHeaderProps,
  INotificationActionsProps,
  INotificationButtonProps,
};

interface INotification extends FC<INotificationProps> {
  Header: FC<INotificationHeaderProps>;
  Actions: FC<INotificationActionsProps>;
  Button: FC<INotificationButtonProps>;
}

export const Notification: INotification =
  NotificationContainer as INotification;
Notification.Header = NotificationHeader;
Notification.Actions = NotificationActions;
Notification.Button = NotificationButton;
