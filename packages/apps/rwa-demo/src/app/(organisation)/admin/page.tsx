'use client';

import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useOrganisation } from '@/hooks/organisation';
import { useUser } from '@/hooks/user';
import { Button, Stack } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';

const Home = () => {
  const { addClaim, userToken } = useUser();
  const { organisation } = useOrganisation();

  const handleAddAdmin = async () => {
    await addClaim({ orgAdmin: true });
  };

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection="column" width="100%">
        organisation
        <Button onPress={handleAddAdmin}>add organisation admin role</Button>
      </Stack>
    </>
  );
};

export default Home;
