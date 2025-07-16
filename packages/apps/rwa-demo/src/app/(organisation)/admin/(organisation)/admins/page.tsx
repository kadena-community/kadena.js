'use client';

import { AdminsList } from '@/components/admin/AdminsList/AdminsList';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useOrganisation } from '@/hooks/organisation';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { AdminBar } from '../AdminBar';

const Home = () => {
  const { organisation } = useOrganisation();

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem component={Link} href="/admin/admins">
          Admins
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <AdminBar />

      <AdminsList organisationId={organisation?.id} />
    </>
  );
};

export default Home;
