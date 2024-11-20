import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { INotificationProps } from 'src/components';

export type INotificationMinimizedProps = Pick<
  INotificationProps,
  'icon' | 'role' | 'isDismissable' | 'onDismiss' | 'intent'
> & {
  id: string;
  label: string;
  message: string;
};

interface INotificationsContext {
  notifications: INotificationMinimizedProps[];
  addNotification: (notification: Partial<INotificationMinimizedProps>) => void;
  removeNotification: (notification: INotificationMinimizedProps) => void;
}

export const NotificationsContext = createContext<INotificationsContext>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export interface INotificationsProvider extends PropsWithChildren {}

export const NotificationsProvider: FC<INotificationsProvider> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<
    INotificationMinimizedProps[]
  >([]);

  const removeNotification = (notification: INotificationMinimizedProps) => {
    setNotifications((v) => v.filter((not) => not.id !== notification.id));
  };

  const addNotification = (
    notification: Partial<INotificationMinimizedProps>,
  ) => {
    const notificationProps: INotificationMinimizedProps = {
      ...notification,
      id: crypto.randomUUID(),
      role: notification.role ?? 'status',
      intent: notification.intent ?? 'info',
      label: notification.label!,
      message: notification.message!,
    };

    setNotifications((v) => [...v, notificationProps]);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
