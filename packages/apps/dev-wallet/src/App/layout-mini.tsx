import { MainHeader } from '@/Components/MainHeader/MainHeader';

import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { containerStyle, mainStyle } from './layout-mini.css';

export const LayoutMini: FC = () => {
  return (
    <>
      <MainHeader />
      <main className={mainStyle}>
        <div className={containerStyle}>
          <Outlet />
        </div>
      </main>
      <div id="modalportal"></div>
    </>
  );
};
