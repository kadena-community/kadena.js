import {
  INotificationProps,
  NotificationContainer,
} from './NotificationContainer';
import {
  INotificationFooterProps,
  NotificationFooter,
} from './NotificationFooter';
import {
  INotificationHeaderProps,
  NotificationHeader,
} from './NotificationHeader';

export {
  INotificationProps,
  INotificationHeaderProps,
  INotificationFooterProps,
};

interface INotification {
  Container: React.FC<INotificationProps>;
  Header: React.FC<INotificationHeaderProps>;
  Footer: React.FC<INotificationFooterProps>;
}

export const Notification: INotification = {
  Header: NotificationHeader,
  Container: NotificationContainer,
  Footer: NotificationFooter,
};
