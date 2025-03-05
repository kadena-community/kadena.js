import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { FocussedLayoutProvider } from './../../../FocussedLayout/components/LayoutProvider/FocussedLayoutProvider';
import { NotificationsProvider } from './../../../LayoutUtils';
import { LandingPageLayoutProvider } from './LandingPageLayoutProvider';

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NotificationsProvider>
      <FocussedLayoutProvider>
        <LandingPageLayoutProvider>{children}</LandingPageLayoutProvider>
      </FocussedLayoutProvider>
    </NotificationsProvider>
  );
};
