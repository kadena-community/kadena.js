import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass } from '../sidebar.css';
import { useLayout } from './LayoutProvider';
import { SideBarItem } from './SideBarItem';

export interface ISideBarAppContext extends PropsWithChildren {}

export const SideBarAppContext: FC<ISideBarAppContext> = ({ children }) => {
  const { isExpanded, appContext } = useLayout();

  return (
    <header style={{ pointerEvents: 'all' }}>
      <ul
        className={listClass({ direction: 'vertical', expanded: isExpanded })}
      >
        {children}

        {appContext && <SideBarItem {...appContext} />}
      </ul>
    </header>
  );
};
