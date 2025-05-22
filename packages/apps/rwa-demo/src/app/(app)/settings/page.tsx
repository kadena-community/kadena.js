'use client';
import { AssetsList } from '@/components/AssetsList/AssetsList';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { WalletsList } from '@/components/WalletsList/WalletsList';
import { Link, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';

const Home = () => {
  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/settings">
          settings
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection="column" width="100%" gap="md">
        <WalletsList />

        <AssetsList />
      </Stack>
    </>
  );
};

export default Home;
