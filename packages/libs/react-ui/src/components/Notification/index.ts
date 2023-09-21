import type { INotificationActionsProps } from './NotificationActions';
import { NotificationActions } from './NotificationActions';
import type { INotificationButtonProps } from './NotificationButton';
import { NotificationButton } from './NotificationButton';
import type { INotificationProps } from './NotificationContainer';
import { NotificationContainer } from './NotificationContainer';

import type { FC } from 'react';

export type { INotificationProps, INotificationActionsProps };

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
