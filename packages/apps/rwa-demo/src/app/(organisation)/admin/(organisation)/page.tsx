'use client';
import { OrganisationInfoForm } from '@/components/admin/OrganisationInfoForm/OrganisationInfoForm';
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
    await addClaim({ orgAdmin: true });
  };

  if (!organisation) return null;

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection="column" width="100%">
        organisation
        <Stack gap="sm">
          <Button onPress={handleAddAdmin}>add organisation admin role</Button>
        </Stack>
      </Stack>

      <OrganisationInfoForm organisationId={organisation?.id} />
    </>
  );
};

export default Home;
