import {
  MonoLightMode,
  MonoSwapHoriz,
  MonoWallet,
  MonoWorkspaces,
} from '@kadena/kode-icons/system';

import { NetworkSelector } from '@/Components/NetworkSelector/NetworkSelector';
import { PreviewBanner } from '@/Components/PreviewBanner/PreviewBanner';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Badge, Stack, Themes, useTheme } from '@kadena/kode-ui';
import {
  SideBarFooter,
  SideBarFooterItem,
  SideBarLayout,
  SideBarTopBanner,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import classNames from 'classnames';
import { FC, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { usePatchedNavigate } from '../../utils/usePatchedNavigate';
import { KLogo } from './KLogo';
import { SideBar } from './SideBar';
import {
  isExpandedMainClass,
  isNotExpandedClass,
  mainContainerClass,
  mobileNetworkClass,
} from './style.css';

export const Layout: FC = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = usePatchedNavigate();
  const { isExpanded } = useSideBarLayout();
  const { activeNetwork } = useWallet();

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

  const network = activeNetwork?.name || activeNetwork?.networkId;

  return (
    <>
      <SideBarTopBanner>
        <PreviewBanner />
      </SideBarTopBanner>
      <SideBarLayout
        location={innerLocation}
        logo={
          <Stack gap={'sm'} flexDirection={'row'} alignItems={'center'}>
            <Link to="/">
              <KLogo />
            </Link>
            {network && (
              <Badge
                size="sm"
                style="highContrast"
                className={mobileNetworkClass}
              >
                {network}
              </Badge>
            )}
          </Stack>
        }
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
          flex={1}
        >
          <Outlet />
        </Stack>
        <div id="plugins-container" />
      </SideBarLayout>

      <div id="modalportal"></div>
    </>
  );
};
