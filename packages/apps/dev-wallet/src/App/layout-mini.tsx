import { Stack } from '@kadena/kode-ui';
import { SideBarLayout } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { containerStyle } from './layout-mini.css';

export const LayoutMini: FC = () => {
  return (
    <>
      <Stack className={containerStyle}>
        <Outlet />
      </Stack>

      <div id="modalportal"></div>
    </>
  );
};
