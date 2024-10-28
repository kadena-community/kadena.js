import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { useSideBar } from '../SideBarProvider';
import { listClass } from '../style.css';

export interface ISideBarContext extends PropsWithChildren {}

export const SideBarContext: FC<ISideBarContext> = ({ children }) => {
  const { isExpanded } = useSideBar();
  return (
    <footer>
      <ul
        className={listClass({ direction: 'vertical', expanded: isExpanded })}
      >
        {children}
      </ul>
    </footer>
  );
};
