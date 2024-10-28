import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { useSideBar } from './SideBarProvider';
import { menuWrapperClass } from './style.css';

export interface ISideBar extends PropsWithChildren {
  activeUrl?: string;
  logo?: ReactElement;
}

export const SideBar: FC<ISideBar> = ({
  children,

  activeUrl,
  logo,
}) => {
  const { isExpanded } = useSideBar();

  return (
    <aside className={menuWrapperClass({ expanded: isExpanded })}>
      {children}
    </aside>
  );
};
