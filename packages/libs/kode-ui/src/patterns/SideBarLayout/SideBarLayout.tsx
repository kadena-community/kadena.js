import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { MediaContextProvider } from './../../components';
import { Innerlayout } from './InnerLayout';
import { SideBarProvider } from './components/SideBarProvider';

export interface ISideBarLayout extends PropsWithChildren {
  topBanner?: ReactElement;
}
export const SideBarLayout: FC<ISideBarLayout> = ({ children, topBanner }) => {
  return (
    <MediaContextProvider>
      <SideBarProvider>
        <Innerlayout topBanner={topBanner}>{children}</Innerlayout>
      </SideBarProvider>
    </MediaContextProvider>
  );
};
