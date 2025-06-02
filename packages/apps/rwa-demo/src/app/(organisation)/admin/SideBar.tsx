import { KLogo } from '@/app/(app)/KLogo';
import { SidebarSideContext } from '@/components/SidebarSideContext/SidebarSideContext';
import { useUser } from '@/hooks/user';
import { MonoBeenhere, MonoBusiness } from '@kadena/kode-icons';
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
  const { userToken } = useUser();
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
          {userToken?.claims.rootAdmin && (
            <SideBarTree visual={<MonoBeenhere />} label="Root">
              <SideBarTreeItem
                label="Organisations"
                component={Link}
                href={`/admin/root`}
              />
              <SideBarTreeItem
                label="Admins"
                component={Link}
                href={`/admin/root/admins`}
              />
            </SideBarTree>
          )}

          {userToken?.claims.orgAdmins && (
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
              <SideBarTreeItem
                label="Users"
                component={Link}
                href={`/admin/users`}
              />
            </SideBarTree>
          )}
        </>
      }
      context={<SidebarSideContext />}
    ></SideBarLayout>
  );
};
