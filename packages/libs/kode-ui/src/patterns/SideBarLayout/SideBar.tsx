import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { useSideBar } from './components/SideBarProvider';
import {
  menuWrapperClass,
  menuWrapperMobileExpandedClass,
} from './sidebar.css';

export interface ISideBarProps extends PropsWithChildren {
  activeUrl?: string;
  logo?: ReactElement;
}

export const SideBar: FC<ISideBarProps> = ({ children }) => {
  const { isExpanded } = useSideBar();

  return (
    <aside
      className={classNames(menuWrapperClass({ expanded: isExpanded }), {
        [menuWrapperMobileExpandedClass]: isExpanded,
      })}
    >
      {children}
    </aside>
  );
};
