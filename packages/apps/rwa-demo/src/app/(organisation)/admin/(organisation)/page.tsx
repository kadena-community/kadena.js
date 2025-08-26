'use client';
import { OrganisationInfoForm } from '@/components/admin/OrganisationInfoForm/OrganisationInfoForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useOrganisation } from '@/hooks/organisation';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { AdminBar } from './AdminBar';

const Home = () => {
  const { organisation } = useOrganisation();

  if (!organisation) return null;

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <AdminBar />

      <OrganisationInfoForm organisationId={organisation?.id} />
    </>
  );
};

export default Home;
