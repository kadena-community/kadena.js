import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { useEffect } from 'react';
import { NotificationSlot } from '../LayoutUtils';
import { MediaContextProvider, Stack } from './../../components';
import { useLayout } from './components/LayoutProvider';
import { SideBarAside } from './components/SideBarAside';
import { SideBarHeader } from './components/SideBarHeader';
import { bodyWrapperClass, layoutWrapperClass, mainClass } from './styles.css';
import type { ISideBarLayoutLocation } from './types';

export interface ISideBarLayout extends PropsWithChildren {
  topBanner?: ReactElement;
  logo?: ReactElement;
  sidebar?: ReactElement;
  footer?: ReactElement;
  variant?: 'default' | 'full';
  location?: ISideBarLayoutLocation;
}
export const SideBarLayout: FC<ISideBarLayout> = ({
  children,
  topBanner,
  logo,
  sidebar,
  footer,
  variant = 'default',
  location,
}) => {
  const {
    isExpanded,
    setLocation,
    isRightAsideExpanded,
    setIsRightAsideExpanded,
  } = useLayout();

  // set the active URL in your app.
  //we dont know what route system is being used so the active URL will be given as a prop to the component
  //and then saved in the layout
  useEffect(() => {
    setLocation(location);
  }, [location?.url, location?.hash]);

  useEffect(() => {
    if (!isRightAsideExpanded) return;
    setIsRightAsideExpanded(false);
  }, [location?.url]);

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
            layoutWrapperClass({
              isRightExpanded: isRightAsideExpanded ?? false,
              isLeftExpanded: isExpanded ?? false,
            }),
          )}
        >
          <SideBarHeader logo={logo} />
          {sidebar}
          <main className={mainClass}>
            <Stack width="100%" flexDirection="column" marginInlineEnd="sm">
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

              <Stack flex={1}>{children}</Stack>
            </Stack>
            <SideBarAside location={location} />
            <NotificationSlot />
          </main>

          {footer}
        </Stack>
      </Stack>
    </MediaContextProvider>
  );
};
