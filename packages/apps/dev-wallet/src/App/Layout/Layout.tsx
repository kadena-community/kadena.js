import {
  MonoLightMode,
  MonoWifiTethering,
  MonoWindow,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { Themes, useTheme } from '@kadena/kode-ui';
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
      <SideBarLayout
        topBanner={<BetaHeader />}
        sidebar={<SideBar />}
        footer={
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
        }
      >
        <Outlet />
      </SideBarLayout>

      <div id="modalportal"></div>
    </>
  );
};
