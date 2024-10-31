import {
  MonoKey,
  MonoLightMode,
  MonoWifiTethering,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { BreadCrumbs } from '@/pages/BreadCrumbs/BreadCrumbs';
import { Themes, useTheme } from '@kadena/kode-ui';
import {
  SideBarFooter,
  SideBarFooterItem,
  SideBarLayout,
  useSideBar,
} from '@kadena/kode-ui/patterns';
import { FC, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BetaHeader } from './../BetaHeader';
import { SideBar } from './SideBar';

export const Layout: FC = () => {
  const { theme, setTheme } = useTheme();
  const { breadCrumbs, setBreadCrumbs, setAppContext } = useSideBar();
  const location = useLocation();

  useEffect(() => {
    if (
      breadCrumbs.length > 0 &&
      location.pathname !== breadCrumbs[breadCrumbs.length - 1].url
    ) {
      setBreadCrumbs([]);
      setAppContext();
    }
  }, [location]);

  const toggleTheme = (): void => {
    const newTheme = theme === Themes.dark ? Themes.light : Themes.dark;
    setTheme(newTheme);
  };
  return (
    <>
      <SideBarLayout
        topBanner={<BetaHeader />}
        breadcrumbs={<BreadCrumbs />}
        activeUrl={location.pathname}
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
