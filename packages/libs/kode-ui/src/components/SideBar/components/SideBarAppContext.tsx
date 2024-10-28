import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { useSideBar } from '../SideBarProvider';
import { listClass } from '../style.css';

export interface ISideBarAppContext extends PropsWithChildren {}

export const SideBarAppContext: FC<ISideBarAppContext> = ({ children }) => {
  const { isExpanded } = useSideBar();
  return (
    <header>
      <ul
        className={listClass({ direction: 'vertical', expanded: isExpanded })}
      >
        {children}
      </ul>
    </header>
  );
};
