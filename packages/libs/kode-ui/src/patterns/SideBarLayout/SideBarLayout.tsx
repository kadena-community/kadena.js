import classNames from 'classnames';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { NotificationSlot } from '../LayoutUtils';
import { MediaContextProvider, Stack } from './../../components';
import { useLayout } from './components/LayoutProvider';
import { SideBarAside } from './components/SideBarAside';
import { SideBarHeader } from './components/SideBarHeader';
import {
  bodyWrapperClass,
  layoutWrapperClass,
  mainClass,
  topbannerWrapperClass,
} from './styles.css';
import type { ISideBarLayoutLocation } from './types';

export interface ISideBarLayout extends PropsWithChildren {
  logo?: ReactElement;
  sidebar?: ReactElement;
  footer?: ReactElement;
  variant?: 'default' | 'full';
  location?: ISideBarLayoutLocation;
}
export const SideBarLayout: FC<ISideBarLayout> = ({
  children,
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
    setTopbannerRef,
  } = useLayout();

  const [topbannerHeight, setTopBannerHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!ref?.current) return;
    setTopbannerRef(ref.current);
  }, [ref.current]);

  useEffect(() => {
    if (!ref?.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!ref?.current) return;
      const boundingBox = ref.current.getBoundingClientRect();
      setTopBannerHeight(boundingBox.height);
    });
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

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
          <div id="topbanners" ref={ref} className={topbannerWrapperClass} />
          <SideBarHeader logo={logo} topbannerHeight={topbannerHeight} />
          {sidebar &&
            React.cloneElement(sidebar, { ...sidebar?.props, topbannerHeight })}
          <main className={mainClass} style={{ top: topbannerHeight }}>
            <Stack width="100%" flexDirection="column" marginInlineEnd="sm">
              <Stack flex={1}>{children}</Stack>
            </Stack>
            <SideBarAside
              topbannerHeight={topbannerHeight}
              location={location}
            />
            <NotificationSlot />
          </main>

          {footer}
        </Stack>
      </Stack>
    </MediaContextProvider>
  );
};
