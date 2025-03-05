import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { NotificationsProvider } from './../../../LayoutUtils';
import { FocussedLayoutProvider } from './FocussedLayoutProvider';

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NotificationsProvider>
      <FocussedLayoutProvider>{children}</FocussedLayoutProvider>
    </NotificationsProvider>
  );
};
