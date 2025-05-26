import { KLogo } from '@/app/(app)/KLogo';
import { SidebarSideContext } from '@/components/SidebarSideContext/SidebarSideContext';
import { MonoBusiness } from '@kadena/kode-icons';
import {
  SideBar as SideBarLayout,
  SideBarTree,
  SideBarTreeItem,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';

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
          <SideBarTree visual={<MonoBusiness />} label="Organisation">
            <SideBarTreeItem
              label="Organisation"
              component={Link}
              href={`/admin`}
            />
            <SideBarTreeItem
              label="Assets"
              component={Link}
              href={`/admin/assets`}
            />
          </SideBarTree>
        </>
      }
      context={<SidebarSideContext />}
    ></SideBarLayout>
  );
};
