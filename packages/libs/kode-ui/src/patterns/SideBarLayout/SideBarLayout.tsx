import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { useEffect } from 'react';
import { MediaContextProvider, Stack } from './../../components';

import { SideBarAside } from './components/SideBarAside';
import { SideBarHeader } from './components/SideBarHeader';
import { useSideBar } from './components/SideBarProvider';
import {
  bodyWrapperClass,
  layoutExpandedWrapperClass,
  layoutWrapperClass,
  mainClass,
} from './styles.css';

export interface ISideBarLayout extends PropsWithChildren {
  topBanner?: ReactElement;
  logo?: ReactElement;
  minifiedLogo?: ReactElement;
  breadcrumbs?: ReactElement;
  sidebar?: ReactElement;
  footer?: ReactElement;
  variant?: 'default' | 'full';
  activeUrl?: string;
}
export const SideBarLayout: FC<ISideBarLayout> = ({
  children,
  topBanner,
  logo,
  minifiedLogo,
  breadcrumbs,
  sidebar,
  footer,
  variant = 'default',
  activeUrl,
}) => {
  const { isExpanded, setActiveUrl } = useSideBar();

  // set the active URL in your app.
  //we dont know what route system is being used so the active URL will be given as a prop to the component
  //and then saved in the layout
  useEffect(() => {
    setActiveUrl(activeUrl);
  }, [activeUrl]);

  return (
    <MediaContextProvider>
      <Stack
        width="100%"
        flexDirection="column"
        position="relative"
        className={bodyWrapperClass}
      >
        <Stack
          className={classNames(
            layoutWrapperClass({ variant, hasTopBanner: !!topBanner }),
            {
              [layoutExpandedWrapperClass]: isExpanded,
            },
          )}
        >
          {topBanner && (
            <Stack
              style={{
                gridArea: 'sidebarlayout-topbanner',
                overflowY: 'hidden',
              }}
            >
              {topBanner}
            </Stack>
          )}
          <SideBarHeader
            breadcrumbs={breadcrumbs}
            hasSidebar={!!sidebar}
            logo={logo}
            minifiedLogo={minifiedLogo}
          />
          {sidebar}
          <main className={mainClass({ variant })}>{children}</main>
          <SideBarAside hasTopBanner={!!topBanner} />
          {footer}
        </Stack>
      </Stack>
    </MediaContextProvider>
  );
};
