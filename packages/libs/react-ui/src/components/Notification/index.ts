import type { FC } from 'react';
import type { INotificationButtonProps } from './NotificationButton';
import { NotificationButton } from './NotificationButton';
import type { INotificationRootProps } from './NotificationRoot';
import { NotificationRoot } from './NotificationRoot';
import type {
  INotificationActionsProps,
  INotificationHeadingProps,
} from './NotificationSubComponents';
import {
  NotificationActions,
  NotificationHeading,
} from './NotificationSubComponents';

export type {
  INotificationActionsProps,
  INotificationButtonProps,
  INotificationHeadingProps,
  INotificationRootProps,
};

interface INotification {
  Root: FC<INotificationRootProps>;
  Actions: FC<INotificationActionsProps>;
  Button: FC<INotificationButtonProps>;
  Heading: FC<INotificationHeadingProps>;
}

export const Notification: INotification = {
  Root: NotificationRoot,
  Actions: NotificationActions,
  Button: NotificationButton,
  Heading: NotificationHeading,
};
