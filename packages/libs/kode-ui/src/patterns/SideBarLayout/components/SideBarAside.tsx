import type { FC } from 'react';
import React from 'react';
import { asideWrapperClass, menuBackdropClass } from '../aside.css';
import type { PressEvent } from './../../../components';
import { Stack } from './../../../components';
import { useSideBar } from './SideBarProvider';

export const SideBarAside: FC = () => {
  const { handleToggleExpand } = useSideBar();

  const handleExpand = (e: PressEvent) => {
    if (handleToggleExpand) {
      handleToggleExpand(e);
    }
  };
  return (
    <>
      <Stack
        className={menuBackdropClass({ expanded: false })}
        onClick={handleExpand}
      />
      <aside className={asideWrapperClass()}>aside info</aside>
    </>
  );
};
