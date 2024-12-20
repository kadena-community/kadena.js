import {
  MonoLightMode,
  MonoSwapHoriz,
  MonoWallet,
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
import { usePatchedNavigate } from '../../utils/usePatchedNavigate';
import { SideBar } from './SideBar';
import {
  isExpandedMainClass,
  isNotExpandedClass,
  mainContainerClass,
} from './style.css';

export const Layout: FC = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = usePatchedNavigate();
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
              visual={<MonoWallet />}
              label="Your Assets"
            />

            <SideBarFooterItem
              href="/transfer"
              component={Link}
              visual={<MonoSwapHoriz />}
              label="transfer"
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
