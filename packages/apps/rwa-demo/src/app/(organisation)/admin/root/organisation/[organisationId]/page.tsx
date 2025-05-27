'use client';
import { OrganisationInfoForm } from '@/components/admin/OrganisationInfoForm/OrganisationInfoForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationStore } from '@/utils/store/organisationStore';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Home = ({ params }: { params: { organisationId: string } }) => {
  const [organisation, setOrganisation] = useState<IOrganisation | undefined>();

  const init = async (organisationId: IOrganisation['id']) => {
    const orgStore = await OrganisationStore(organisationId);
    if (!orgStore) return;
    const data = await orgStore.getOrganisation();
    setOrganisation(data);
  };

  useEffect(() => {
    if (!params.organisationId) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init(params.organisationId);
  }, [params.organisationId]);

  if (!organisation) return null;
  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin/root">
          root
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem
          component={Link}
          href={`/admin/root/organisations/${organisation?.id}`}
        >
          {organisation?.name}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <OrganisationInfoForm organisationId={organisation.id} />
    </>
  );
};

export default Home;
