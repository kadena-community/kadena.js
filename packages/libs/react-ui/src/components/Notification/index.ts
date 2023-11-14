import type { FC } from 'react';
import type { INotificationButtonProps } from './NotificationButton';
import { NotificationButton } from './NotificationButton';
import type { INotificationRootProps } from './NotificationRoot';
import { NotificationRoot } from './NotificationRoot';
import type { IBaseProps } from './NotificationSubComponents';
import {
  NotificationActions,
  NotificationHeading,
} from './NotificationSubComponents';

export type { INotificationButtonProps, INotificationRootProps };

interface INotification {
  Root: FC<INotificationRootProps>;
  Actions: FC<IBaseProps>;
  Button: FC<INotificationButtonProps>;
  Heading: FC<IBaseProps>;
}

export const Notification: INotification = {
  Root: NotificationRoot,
  Actions: NotificationActions,
  Button: NotificationButton,
  Heading: NotificationHeading,
};
