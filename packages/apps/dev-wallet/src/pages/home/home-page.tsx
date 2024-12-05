import { AssetsCard } from '@/Components/AssetsCard/AssetsCard';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { MonoDashboard } from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';

export function HomePage() {
  return (
    <>
      <SideBarBreadcrumbs icon={<MonoDashboard />}>
        <SideBarBreadcrumbsItem href="/">Your Assets</SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack gap={'lg'} flexDirection={'column'} width="100%">
        <AssetsCard />
      </Stack>
    </>
  );
}
