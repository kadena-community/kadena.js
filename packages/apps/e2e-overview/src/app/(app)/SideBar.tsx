import { SidebarSideContext } from '@/components/SidebarSideContext/SidebarSideContext';
import { MonoApps } from '@kadena/kode-icons';
import {
  SideBarItem,
  SideBar as SideBarLayout,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';
import { KLogo } from './KLogo';

export const SideBar: FC<{ topbannerHeight?: number }> = ({
  topbannerHeight = 0,
}) => {
  return (
    <SideBarLayout
      topbannerHeight={topbannerHeight}
      logo={
        <>
          <Link href="/">
            <KLogo />
          </Link>
        </>
      }
      navigation={
        <>
          <SideBarItem
            visual={<MonoApps />}
            label="Dashboard"
            component={Link}
            href="/"
          />
        </>
      }
      appContext={<></>}
      context={<SidebarSideContext />}
    ></SideBarLayout>
  );
};
