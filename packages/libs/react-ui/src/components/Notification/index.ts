import type { INotificationActionsProps } from './NotificationActions';
import { NotificationActions } from './NotificationActions';
import type { INotificationButtonProps } from './NotificationButton';
import { NotificationButton } from './NotificationButton';
import type { INotificationProps } from './NotificationContainer';
import { NotificationContainer } from './NotificationContainer';
import type { INotificationHeaderProps } from './NotificationHeader';
import { NotificationHeader } from './NotificationHeader';

import { FC } from 'react';

export type {
  INotificationProps,
  INotificationHeaderProps,
  INotificationActionsProps,
  INotificationButtonProps,
};

interface INotification {
  Root: FC<INotificationProps>;
  Header: FC<INotificationHeaderProps>;
  Actions: FC<INotificationActionsProps>;
  Button: FC<INotificationButtonProps>;
}

export const Notification: INotification = {
  Root: NotificationContainer,
  Header: NotificationHeader,
  Actions: NotificationActions,
  Button: NotificationButton,
};
