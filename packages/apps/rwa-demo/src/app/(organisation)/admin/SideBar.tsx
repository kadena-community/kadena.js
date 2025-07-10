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
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

export const SideBar: FC<{ topbannerHeight?: number }> = ({
  topbannerHeight = 0,
}) => {
  const { userToken } = useUser();
  const pathName = usePathname();
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
                isActive={pathName === '/admin/root'}
                label="Organisations"
                component={Link}
                href={`/admin/root`}
              />
              <SideBarTreeItem
                isActive={pathName === `/admin/root/admins`}
                label="Root admins"
                component={Link}
                href={`/admin/root/admins`}
              />
            </SideBarTree>
          )}

          {userToken?.claims.orgAdmins && (
            <SideBarTree visual={<MonoBusiness />} label="Organisation">
              <SideBarTreeItem
                isActive={pathName === `/admin`}
                label="Organisation"
                component={Link}
                href={`/admin`}
              />
              <SideBarTreeItem
                label="Assets"
                component={Link}
                href={`/admin/assets`}
                isActive={pathName === `/admin/assets`}
              />
              <SideBarTreeItem
                label="Users"
                component={Link}
                href={`/admin/users`}
                isActive={pathName === `/admin/users`}
              />
              <SideBarTreeItem
                label="Admins"
                component={Link}
                href={`/admin/admins`}
                isActive={pathName === `/admin/admins`}
              />
            </SideBarTree>
          )}
        </>
      }
      context={<SidebarSideContext />}
    ></SideBarLayout>
  );
};
