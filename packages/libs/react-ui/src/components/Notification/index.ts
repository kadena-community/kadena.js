import {
  type INotificationActionsProps,
  NotificationActions,
} from './NotificationActions';
import {
  type INotificationButtonProps,
  NotificationButton,
} from './NotificationButton';
import {
  type INotificationProps,
  NotificationContainer,
} from './NotificationContainer';

import { type FC } from 'react';

export type {
  INotificationProps,
  INotificationActionsProps,
  INotificationButtonProps,
};

interface INotification {
  Root: FC<INotificationProps>;
  Actions: FC<INotificationActionsProps>;
  Button: FC<INotificationButtonProps>;
}

export const Notification: INotification = {
  Root: NotificationContainer,
  Actions: NotificationActions,
  Button: NotificationButton,
};
