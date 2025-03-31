import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { listClass } from '../sidebar.css';
import { useLayout } from './LayoutProvider';

export interface ISideBarContext extends PropsWithChildren {}

export const SideBarContext: FC<ISideBarContext> = ({ children }) => {
  const { isExpanded } = useLayout();
  return (
    <footer style={{ pointerEvents: 'all' }}>
      <ul
        className={listClass({ direction: 'vertical', expanded: isExpanded })}
      >
        {children}
      </ul>
    </footer>
  );
};
