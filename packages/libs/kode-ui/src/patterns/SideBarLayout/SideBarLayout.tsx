import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { MediaContextProvider, Stack } from './../../components';

import { SideBarHeader } from './components/SideBarHeader';
import { useSideBar } from './components/SideBarProvider';
import {
  layoutExpandedWrapperClass,
  layoutWrapperClass,
  mainClass,
} from './styles.css';

export interface ISideBarLayout extends PropsWithChildren {
  topBanner?: ReactElement;
  breadcrumbs?: ReactElement;
  sidebar?: ReactElement;
  footer?: ReactElement;
  variant?: 'default' | 'full';
}
export const SideBarLayout: FC<ISideBarLayout> = ({
  children,
  topBanner,
  breadcrumbs,
  sidebar,
  footer,
  variant = 'default',
}) => {
  const { isExpanded } = useSideBar();
  return (
    <MediaContextProvider>
      <Stack
        width="100%"
        flexDirection="column"
        position="relative"
        style={{ minHeight: '100dvh' }}
      >
        {topBanner}
        <Stack
          className={classNames(layoutWrapperClass({ variant }), {
            [layoutExpandedWrapperClass]: isExpanded,
          })}
        >
          <SideBarHeader breadcrumbs={breadcrumbs} hasSidebar={!!sidebar} />
          {sidebar}
          <main className={mainClass({ variant })}>{children}</main>
          {footer}
        </Stack>
      </Stack>
    </MediaContextProvider>
  );
};
