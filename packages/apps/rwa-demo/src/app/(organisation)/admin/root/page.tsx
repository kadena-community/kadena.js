'use client';

import { OrganisationsList } from '@/components/admin/OrganisationsList/OrganisationsList';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useOrganisation } from '@/hooks/organisation';
import { useUser } from '@/hooks/user';
import { Button, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';

const Home = () => {
  const { addClaim } = useUser();
  const { organisation } = useOrganisation();

  const handleAddAdmin = async () => {
    await addClaim({ rootAdmin: true });
  };

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem component={Link} href="/admin/root">
          root
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection="column" width="100%">
        root
        <Button onPress={handleAddAdmin}>add admin role</Button>
      </Stack>

      <OrganisationsList />
    </>
  );
};

export default Home;
