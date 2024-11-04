import { SideBarLayout } from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { containerStyle } from './layout-mini.css';

export const LayoutMini: FC = () => {
  return (
    <>
      <SideBarLayout variant="full">
        <div className={containerStyle}>
          <Outlet />
        </div>
      </SideBarLayout>
      <div id="modalportal"></div>
    </>
  );
};
