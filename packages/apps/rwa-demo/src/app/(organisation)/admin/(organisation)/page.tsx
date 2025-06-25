'use client';
import { AdminsList } from '@/components/admin/AdminsList/AdminsList';
import { OrganisationInfoForm } from '@/components/admin/OrganisationInfoForm/OrganisationInfoForm';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useOrganisation } from '@/hooks/organisation';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AdminBar } from './AdminBar';

const Home = () => {
  const { organisation } = useOrganisation();
  const searchParams = useSearchParams();
  const p = searchParams.get('p') || 'info';

  if (!organisation) return null;

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <AdminBar />

      {p === 'info' && (
        <OrganisationInfoForm organisationId={organisation?.id} />
      )}
      {p === 'admins' && <AdminsList organisationId={organisation?.id} />}
    </>
  );
};

export default Home;
