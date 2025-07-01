import { AccountSwitch } from '@/components/AccountSwitch/AccountSwitch';
import { AssetSetupProgress } from '@/components/AssetSetupCompletionOverview/AssetSetupProgress';
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
import { Badge, Stack } from '@kadena/kode-ui';
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
  const { agents, investors, agentsIsLoading, investorsIsLoading, asset } =
    useAsset();
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
              label={
                <Stack gap="xs" alignItems="center">
                  Agents
                  {agentsIsLoading ? (
                    <TransactionPendingIcon />
                  ) : (
                    <Badge size="sm">{agents.length}</Badge>
                  )}
                </Stack>
              }
              component={Link}
              href="/agents"
            />
          )}
          {(isAgent || isOwner || isComplianceOwner || isInvestor) && (
            <SideBarItem
              visual={<MonoAttachMoney />}
              label={
                <Stack gap="xs" alignItems="center">
                  Investors
                  {investorsIsLoading ? (
                    <TransactionPendingIcon />
                  ) : (
                    <Badge size="sm">{investors.length}</Badge>
                  )}
                </Stack>
              }
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
          <AssetSetupProgress asset={asset} />
        </SideBarItem>
      }
      context={<SidebarSideContext />}
    ></SideBarLayout>
  );
};
