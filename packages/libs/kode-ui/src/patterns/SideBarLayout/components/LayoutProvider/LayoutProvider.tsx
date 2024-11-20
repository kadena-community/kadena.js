import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { NotificationsProvider } from './NotificationsProvider';
import { SideBarLayoutProvider } from './SideBarLayoutProvider';

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NotificationsProvider>
      <SideBarLayoutProvider>{children}</SideBarLayoutProvider>
    </NotificationsProvider>
  );
};
