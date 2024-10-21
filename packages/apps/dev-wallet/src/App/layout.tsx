import { backgroundStyle, mainColumnStyle } from '@/App/layout.css.ts';
import { MainHeader } from '@/Components/MainHeader/MainHeader';
import { Sidebar } from '@/Components/Sidebar/Sidebar.tsx';
import { pageClass } from '@/pages/home/style.css.ts';

import { Box, Stack } from '@kadena/kode-ui';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const Layout: FC = () => {
  return (
    <>
      <MainHeader />
      <main>
        <Stack
          className={pageClass}
          style={
            {
              // backgroundImage: `radial-gradient(circle farthest-side at 50% 170%, ${accentColor}, transparent 75%)`,
            }
          }
        >
          <Sidebar></Sidebar>
          <Box padding="n10" className={mainColumnStyle}>
            <div className={backgroundStyle}></div>
            <Outlet />
          </Box>
        </Stack>
      </main>
      <div id="modalportal"></div>
    </>
  );
};
