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

export const Notification = {
  Header: NotificationHeader,
  Container: NotificationContainer,
  Footer: NotificationFooter,
};
