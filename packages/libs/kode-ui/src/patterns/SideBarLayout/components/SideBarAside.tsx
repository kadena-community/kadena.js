import { MonoClose } from '@kadena/kode-icons/system';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import {
  asideContentClass,
  asideHeaderClass,
  asideHeaderCloseButtonWrapperClass,
  asideWrapperClass,
  menuBackdropClass,
} from '../aside.css';
import type { PressEvent } from './../../../components';
import { Button, Heading, Stack } from './../../../components';
import { useSideBar } from './SideBarProvider';

export const SideBarAside: FC = () => {
  const { handleToggleAsideExpand, handleSetAsideExpanded, isAsideExpanded } =
    useSideBar();

  const handleExpand = (e: PressEvent) => {
    if (handleToggleAsideExpand) {
      handleToggleAsideExpand(e);
    }
  };

  useEffect(() => {
    const { hash } = window.location;
    handleSetAsideExpanded(!!hash);
    handleSetAsideExpanded(true);
  }, []);

  console.log(isAsideExpanded);
  return (
    <>
      <Stack
        className={menuBackdropClass({ expanded: isAsideExpanded })}
        onClick={handleExpand}
      />
      <aside className={asideWrapperClass({ expanded: isAsideExpanded })}>
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
        <Stack className={asideContentClass}>aside info</Stack>
      </aside>
    </>
  );
};
