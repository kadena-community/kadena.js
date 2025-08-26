'use client';
import { AdminsList } from '@/components/admin/AdminsList/AdminsList';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem component={Link} href="/admin/root">
          root
        </SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem component={Link} href="/admin/root/admins">
          admins
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <AdminsList />
    </>
  );
};

export default Home;
