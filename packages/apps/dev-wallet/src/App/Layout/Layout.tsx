import {
  MonoKey,
  MonoLightMode,
  MonoWifiTethering,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { Stack, Themes, useTheme } from '@kadena/kode-ui';
import {
  SideBarFooter,
  SideBarFooterItem,
  SideBarLayout,
  useLayout,
} from '@kadena/kode-ui/patterns';
import classNames from 'classnames';
import { FC, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheCorrectNavigate } from '../NavigationContext';
import { SideBar } from './SideBar';
import {
  isExpandedMainClass,
  isNotExpandedClass,
  mainContainerClass,
} from './style.css';

export const Layout: FC = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useTheCorrectNavigate();
  const { isExpanded } = useLayout();

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
        <Stack
          flexDirection={'column'}
          className={classNames(
            mainContainerClass,
            isExpanded ? isExpandedMainClass : isNotExpandedClass,
          )}
        >
          <Outlet />
        </Stack>
      </SideBarLayout>

      <div id="modalportal"></div>
    </>
  );
};
