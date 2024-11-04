import { MonoClose } from '@kadena/kode-icons/system';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import {
  asideContentClass,
  asideHeaderClass,
  asideHeaderCloseButtonWrapperClass,
  asideHeadingClass,
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
  const {
    handleSetAsideExpanded,
    isAsideExpanded,
    asideTitle,
    setAsideRef,
    asideRef,
  } = useLayout();
  const ref = useRef<HTMLDivElement | null>();

  const handleExpand = (e: PressEvent) => {
    if (handleSetAsideExpanded) {
      handleSetAsideExpanded(false);
    }
  };

  useEffect(() => {
    if (!ref.current) return;
    setAsideRef(ref.current);
  }, [ref.current]);

  useEffect(() => {
    handleSetAsideExpanded(!!location?.hash);
  }, [location?.hash]);

  return (
    <>
      <Stack
        aria-label="background"
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
          <Stack
            width="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading variant="h6" as="h3" className={asideHeadingClass}>
              {asideTitle}
            </Heading>

            <Stack className={asideHeaderCloseButtonWrapperClass}>
              <Button
                aria-label="close"
                onPress={handleExpand}
                variant="transparent"
                startVisual={<MonoClose />}
              />
            </Stack>
          </Stack>
        </header>

        <Stack className={asideContentClass}>
          <div ref={ref} />
        </Stack>
      </aside>
    </>
  );
};
