import { MonoClose } from '@kadena/kode-icons/system';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import {
  asideContentClass,
  asideHeaderClass,
  asideHeaderCloseButtonWrapperClass,
  asideWrapperClass,
  menuBackdropClass,
} from '../aside.css';
import type { ISideBarLayoutLocation } from '../types';
import type { PressEvent } from './../../../components';
import { Button, Heading, Stack } from './../../../components';
import { useLayout } from './LayoutProvider';

export const SideBarAside: FC<
  PropsWithChildren<{
    hasTopBanner?: boolean;
    location: ISideBarLayoutLocation;
  }>
> = ({ hasTopBanner, location, children }) => {
  const { handleSetAsideExpanded, isAsideExpanded } = useLayout();

  const handleExpand = (e: PressEvent) => {
    if (handleSetAsideExpanded) {
      handleSetAsideExpanded(false);
    }
  };

  useEffect(() => {
    handleSetAsideExpanded(!!location?.hash);
  }, [location?.hash]);

  return (
    <>
      <Stack
        className={menuBackdropClass({
          expanded: isAsideExpanded,
        })}
        onClick={handleExpand}
      />
      <aside
        className={asideWrapperClass({
          expanded: isAsideExpanded,
          hasTopBanner,
        })}
      >
        <header className={asideHeaderClass}>
          <Heading> </Heading>
          <Stack className={asideHeaderCloseButtonWrapperClass}>
            <Button
              onPress={handleExpand}
              variant="transparent"
              startVisual={<MonoClose />}
            />
          </Stack>
        </header>
        <Stack className={asideContentClass}>{children}</Stack>
      </aside>
    </>
  );
};
