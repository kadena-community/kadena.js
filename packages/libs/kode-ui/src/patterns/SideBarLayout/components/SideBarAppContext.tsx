import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass } from '../sidebar.css';
import { SideBarItem } from './SideBarItem';
import { useSideBar } from './SideBarProvider';

export interface ISideBarAppContext extends PropsWithChildren {}

export const SideBarAppContext: FC<ISideBarAppContext> = ({ children }) => {
  const { isExpanded } = useSideBar();
  const { appContext } = useSideBar();
  return (
    <header>
      <ul
        className={listClass({ direction: 'vertical', expanded: isExpanded })}
      >
        {children}

        {appContext && <SideBarItem {...appContext} />}
      </ul>
    </header>
  );
};
