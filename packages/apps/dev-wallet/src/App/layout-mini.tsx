import { MainHeader } from '@/Components/MainHeader/MainHeader';
import { LayoutContext } from '@/modules/layout/layout.provider.tsx';

import { FC, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { containerStyle, mainStyle } from './layout-mini.css';

export const LayoutMini: FC = () => {
  const { layoutContext } = useContext(LayoutContext) ?? [];
  const accentColor = layoutContext?.accentColor;

  return (
    <>
      <MainHeader />
      <main
        className={mainStyle}
        style={{
          backgroundImage: `radial-gradient(circle farthest-side at 50% 170%, ${accentColor}, transparent 75%)`,
        }}
      >
        <div className={containerStyle}>
          <Outlet />
        </div>
      </main>
      <div id="modalportal"></div>
    </>
  );
};
