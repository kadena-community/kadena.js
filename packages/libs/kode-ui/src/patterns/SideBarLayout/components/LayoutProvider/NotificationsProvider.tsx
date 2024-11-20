import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { INotificationProps } from 'src/components';

interface INotificationsContext {
  notifications: INotificationProps[];
  addNotification: (notification: INotificationProps) => void;
}

export const NotificationsContext = createContext<INotificationsContext>({
  notifications: [],
  addNotification: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export interface INotificationsProvider extends PropsWithChildren {}

export const NotificationsProvider: FC<INotificationsProvider> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotificationProps[]>([]);

  const addNotification = (notification: INotificationProps) => {
    setNotifications((v) => [...v, notification]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};
