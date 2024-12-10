'use client';

import { AgentRootPage } from '@/components/HomePage/AgentRootPage';
import { ComplianceOwnerRootPage } from '@/components/HomePage/ComplianceOwnerRootPage';
import { InvestorRootPage } from '@/components/HomePage/InvestorRootPage';
import { OwnerRootPage } from '@/components/HomePage/OwnerRootPage';
import { SideBarBreadcrumbs } from '@/components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { useAccount } from '@/hooks/account';

const Home = () => {
  const { isAgent, isInvestor, isOwner, isComplianceOwner } = useAccount();

  return (
    <>
      <SideBarBreadcrumbs />
      {isComplianceOwner && <ComplianceOwnerRootPage />}
      {isOwner && <OwnerRootPage />}
      {isAgent && <AgentRootPage />}
      {isInvestor && <InvestorRootPage />}
    </>
  );
};

export default Home;
