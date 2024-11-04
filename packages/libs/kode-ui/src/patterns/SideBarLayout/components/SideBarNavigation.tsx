import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass, menuNavWrapperClass } from '../sidebar.css';
import { useLayout } from './LayoutProvider';

export interface ISideBarNavigation extends PropsWithChildren {}

export const SideBarNavigation: FC<ISideBarNavigation> = ({ children }) => {
  const { isExpanded } = useLayout();
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
