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

export {
  INotificationProps,
  INotificationHeaderProps,
  INotificationActionsProps,
  INotificationButtonProps,
};

interface INotification {
  Container: React.FC<INotificationProps>;
  Header: React.FC<INotificationHeaderProps>;
  Actions: React.FC<INotificationActionsProps>;
  Button: React.FC<INotificationButtonProps>;
}

export const Notification: INotification = {
  Header: NotificationHeader,
  Container: NotificationContainer,
  Actions: NotificationActions,
  Button: NotificationButton,
};
