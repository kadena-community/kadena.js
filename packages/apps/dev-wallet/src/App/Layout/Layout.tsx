import { PreviewBanner } from '@/Components/PreviewBanner/PreviewBanner';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Badge, Stack } from '@kadena/kode-ui';
import {
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
      </SideBarLayout>
      <div id="plugins-container" />
      <div id="modalportal"></div>
    </>
  );
};
