import {
  MonoKey,
  MonoLightMode,
  MonoWifiTethering,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { Themes, useTheme } from '@kadena/kode-ui';
import {
  SideBarFooter,
  SideBarFooterItem,
  SideBarLayout,
} from '@kadena/kode-ui/patterns';
import { FC, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BetaHeader } from './../BetaHeader';
import { SideBar } from './SideBar';

export const Layout: FC = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const innerLocation = useMemo(
    () => ({
      url: location.pathname,
      hash: location.hash,
      push: navigate,
    }),
    [location],
  );

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };

  return (
    <>
      <SideBarLayout
        topBanner={<BetaHeader />}
        location={innerLocation}
        sidebar={<SideBar />}
        footer={
          <SideBarFooter>
            <SideBarFooterItem
              href="/"
              component={Link}
              visual={<MonoWifiTethering />}
              label="Profile"
            />

            <SideBarFooterItem
              href="/key-management/keys"
              component={Link}
              visual={<MonoKey />}
              label="Keys"
            />

            <SideBarFooterItem
              visual={<MonoWorkspaces />}
              label="Select network"
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
