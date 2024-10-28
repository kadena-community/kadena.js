import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { SideBarProvider } from './../../components/SideBar/SideBarProvider';
import { Innerlayout } from './InnerLayout';

export interface ISideBarLayout extends PropsWithChildren {}
export const SideBarLayout: FC<ISideBarLayout> = ({ children }) => {
  return (
    <SideBarProvider>
      <Innerlayout>{children}</Innerlayout>
    </SideBarProvider>
  );
};
