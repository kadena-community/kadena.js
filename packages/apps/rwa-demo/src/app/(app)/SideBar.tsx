import { AccountSwitch } from '@/components/AccountSwitch/AccountSwitch';
import { AssetSwitch } from '@/components/AssetSwitch/AssetSwitch';
import { SidebarSideContext } from '@/components/SidebarSideContext/SidebarSideContext';
import { TransactionPendingIcon } from '@/components/TransactionPendingIcon/TransactionPendingIcon';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import {
  MonoApps,
  MonoAttachMoney,
  MonoNetworkCheck,
  MonoSupportAgent,
} from '@kadena/kode-icons';
import { Badge } from '@kadena/kode-ui';
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
  const { agents, investors, agentsIsLoading, investorsIsLoading } = useAsset();
  const { isAgent, isOwner, isComplianceOwner, isInvestor } = useAccount();

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
              endVisual={
                agentsIsLoading ? (
                  <TransactionPendingIcon />
                ) : (
                  <Badge size="sm">{agents.length}</Badge>
                )
              }
              label={'Agents'}
              component={Link}
              href="/agents"
            />
          )}
          {(isAgent || isOwner || isComplianceOwner || isInvestor) && (
            <SideBarItem
              visual={<MonoAttachMoney />}
              endVisual={
                investorsIsLoading ? (
                  <TransactionPendingIcon />
                ) : (
                  <Badge size="sm">{investors.length}</Badge>
                )
              }
              label={'Investors'}
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
