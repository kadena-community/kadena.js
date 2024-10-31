import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass, menuNavWrapperClass } from '../sidebar.css';
import { useSideBar } from './SideBarProvider';

export interface ISideBarNavigation extends PropsWithChildren {}

export const SideBarNavigation: FC<ISideBarNavigation> = ({ children }) => {
  const { isExpanded } = useSideBar();
  return (
    <nav className={menuNavWrapperClass}>
      <ul
        className={listClass({ direction: 'vertical', expanded: isExpanded })}
      >
        {children}
      </ul>
    </nav>
  );
};

SideBarNavigation.displayName = 'SideBarNavigation';
