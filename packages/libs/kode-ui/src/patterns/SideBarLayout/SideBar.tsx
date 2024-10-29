import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { SideBarAppContext } from './components/SideBarAppContext';
import { SideBarContext } from './components/SideBarContext';
import { SideBarNavigation } from './components/SideBarNavigation';
import { useSideBar } from './components/SideBarProvider';
import {
  menuWrapperClass,
  menuWrapperMobileExpandedClass,
} from './sidebar.css';

export interface ISideBarProps extends PropsWithChildren {
  activeUrl?: string;
  logo?: ReactElement;

  appContext?: ReactElement;
  navigation?: ReactElement;
  context?: ReactElement;
}

export const SideBar: FC<ISideBarProps> = ({
  children,
  appContext,
  navigation,
  context,
}) => {
  const { isExpanded } = useSideBar();

  return (
    <aside
      className={classNames(menuWrapperClass({ expanded: isExpanded }), {
        [menuWrapperMobileExpandedClass]: isExpanded,
      })}
    >
      {appContext && <SideBarAppContext>{appContext}</SideBarAppContext>}
      {navigation && <SideBarNavigation>{navigation}</SideBarNavigation>}
      {context && <SideBarContext>{context}</SideBarContext>}

      {children}
    </aside>
  );
};
