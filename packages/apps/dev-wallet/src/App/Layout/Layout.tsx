import { backgroundStyle, mainColumnStyle } from '@/App/layout.css.ts';
import { MainHeader } from '@/Components/MainHeader/MainHeader';
import { Sidebar } from '@/Components/Sidebar/Sidebar.tsx';
import { pageClass } from '@/pages/home/style.css.ts';
import {
  MonoLightMode,
  MonoWifiTethering,
  MonoWindow,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { Box, Stack, Themes, useTheme } from '@kadena/kode-ui';
import {
  SideBarFooter,
  SideBarFooterItem,
  SideBarLayout,
} from '@kadena/kode-ui/patterns';
import { FC } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BetaHeader } from './../BetaHeader';
import { SideBar } from './SideBar';

export const Layout: FC = () => {
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };
  return (
    <>
      <SideBarLayout topBanner={<BetaHeader />}>
        <SideBar />

        <main style={{ gridArea: 'sidebarlayout-main' }}>
          <Outlet />
        </main>
        <SideBarFooter>
          <SideBarFooterItem
            visual={<MonoWindow />}
            label=""
            onPress={() => {}}
          />
          <SideBarFooterItem
            visual={<MonoWifiTethering />}
            label="Profile"
            onPress={() => {
              navigate('/profile');
            }}
          />
          <SideBarFooterItem
            visual={<MonoWorkspaces />}
            label="Select network"
            onPress={() => {}}
          >
            <NetworkSelector variant="transparent" showLabel={false} />
          </SideBarFooterItem>
          <SideBarFooterItem
            visual={<MonoLightMode />}
            label="Change theme"
            onPress={toggleTheme}
          />
        </SideBarFooter>
      </SideBarLayout>
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
