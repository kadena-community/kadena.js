'use client';

import { UsersList } from '@/components/admin/UsersList/UsersList';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useOrganisation } from '@/hooks/organisation';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { AdminBar } from '../AdminBar';

const Home = () => {
  const { organisation } = useOrganisation();

  if (!organisation) return null;

  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin">
          {organisation?.name}
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem component={Link} href="/admin/users">
          Users
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <AdminBar />

      <UsersList organisationId={organisation.id} />
    </>
  );
};

export default Home;
