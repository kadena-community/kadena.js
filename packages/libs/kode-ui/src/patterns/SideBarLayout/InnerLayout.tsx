import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { Stack } from './../../components';
import { SideBarHeader } from './components/SideBarHeader';
import { useSideBar } from './components/SideBarProvider';
import { layoutExpandedWrapperClass, layoutWrapperClass } from './styles.css';

export interface ISideBarLayout extends PropsWithChildren {
  topBanner?: ReactElement;
}
export const Innerlayout: FC<ISideBarLayout> = ({ children, topBanner }) => {
  const { isExpanded } = useSideBar();

  return (
    <Stack
      width="100%"
      flexDirection="column"
      position="relative"
      style={{ minHeight: '100dvh' }}
    >
      {topBanner}
      <Stack
        className={classNames(layoutWrapperClass, {
          [layoutExpandedWrapperClass]: isExpanded,
        })}
      >
        <SideBarHeader />
        {children}
      </Stack>
    </Stack>
  );
};
