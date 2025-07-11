import { KLogo } from '@/app/(app)/KLogo';
import { AccountSwitch } from '@/components/AccountSwitch/AccountSwitch';
import { AssetSwitch } from '@/components/AssetSwitch/AssetSwitch';
import { SidebarSideContext } from '@/components/SidebarSideContext/SidebarSideContext';
import { useOrganisation } from '@/hooks/organisation';
import { useUser } from '@/hooks/user';
import {
  MonoBeenhere,
  MonoBusiness,
  MonoNetworkCheck,
} from '@kadena/kode-icons';
import {
  SideBarItem,
  SideBar as SideBarLayout,
  SideBarTree,
  SideBarTreeItem,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

export const SideBar: FC<{ topbannerHeight?: number }> = ({
  topbannerHeight = 0,
}) => {
  const { isExpanded } = useSideBarLayout();
  const { userToken } = useUser();
  const { organisation } = useOrganisation();
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

          {organisation && userToken?.claims.orgAdmins?.[organisation?.id] && (
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
      appContext={
        <SideBarItem visual={<MonoNetworkCheck />} label="Select Asset">
          <AssetSwitch showLabel={isExpanded} />
          <AccountSwitch showLabel={isExpanded} />
        </SideBarItem>
      }
      context={<SidebarSideContext />}
    ></SideBarLayout>
  );
};
