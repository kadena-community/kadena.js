'use client';

import { InvestorList } from '@/components/InvestorList/InvestorList';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';

const AgentsPage = () => {
  return (
    <>
      <SideBarBreadcrumbs>
        <SideBarBreadcrumbsItem href="/investors">
          Investors
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>
      <InvestorList />
    </>
  );
};

export default AgentsPage;
