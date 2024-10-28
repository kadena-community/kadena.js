import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Stack } from './../../components';
import { SideBarHeader } from './../../components/SideBar/components/SideBarHeader';
import { useSideBar } from './../../components/SideBar/SideBarProvider';
import { layoutExpandedWrapperClass, layoutWrapperClass } from './styles.css';

export interface ISideBarLayout extends PropsWithChildren {}
export const Innerlayout: FC<ISideBarLayout> = ({ children }) => {
  const { isExpanded } = useSideBar();

  return (
    <Stack
      className={classNames(layoutWrapperClass, {
        [layoutExpandedWrapperClass]: isExpanded,
      })}
    >
      <SideBarHeader />
      {children}
    </Stack>
  );
};
