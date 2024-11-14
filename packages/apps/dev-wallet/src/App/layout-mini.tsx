import { Stack, useTheme } from '@kadena/kode-ui';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { containerStyle } from './layout-mini.css';

export const LayoutMini: FC = () => {
  useTheme();
  return (
    <>
      <Stack className={containerStyle}>
        <Outlet />
      </Stack>

      <div id="modalportal"></div>
    </>
  );
};
