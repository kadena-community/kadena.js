import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Innerlayout } from './InnerLayout';
import { SideBarProvider } from './components/SideBarProvider';

export interface ISideBarLayout extends PropsWithChildren {}
export const SideBarLayout: FC<ISideBarLayout> = ({ children }) => {
  return (
    <SideBarProvider>
      <Innerlayout>{children}</Innerlayout>
    </SideBarProvider>
  );
};
