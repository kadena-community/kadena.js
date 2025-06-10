import { AccountSwitch } from '@/components/AccountSwitch/AccountSwitch';
import { AssetSwitch } from '@/components/AssetSwitch/AssetSwitch';
import { SidebarSideContext } from '@/components/SidebarSideContext/SidebarSideContext';
import { useAccount } from '@/hooks/account';
import {
  MonoApps,
  MonoAttachMoney,
  MonoNetworkCheck,
  MonoSupportAgent,
} from '@kadena/kode-icons';
import {
  SideBarItem,
  SideBar as SideBarLayout,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import type { FC } from 'react';
import { KLogo } from './KLogo';

export const SideBar: FC<{ topbannerHeight?: number }> = ({
  topbannerHeight = 0,
}) => {
  const { isExpanded } = useSideBarLayout();
  const { isAgent, isOwner, isComplianceOwner } = useAccount();

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

          {(isOwner || isAgent) && (
            <SideBarItem
              visual={<MonoSupportAgent />}
              label="Agents"
              component={Link}
              href="/agents"
            />
          )}
          {(isAgent || isOwner || isComplianceOwner) && (
            <SideBarItem
              visual={<MonoAttachMoney />}
              label="Investors"
              component={Link}
              href="/investors"
            />
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
