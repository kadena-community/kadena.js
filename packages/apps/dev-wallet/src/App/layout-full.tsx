import { Stack } from '@kadena/kode-ui';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutFullContainerStyle } from './layout-mini.css';

export const LayoutFull: FC = () => {
  return (
    <>
      <Stack className={LayoutFullContainerStyle}>
        <Outlet />
      </Stack>

      <div id="modalportal"></div>
    </>
  );
};
