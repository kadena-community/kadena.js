'use client';

import { AgentRootPage } from '@/components/HomePage/AgentRootPage';
import { InvestorRootPage } from '@/components/HomePage/InvestorRootPage';
import { OwnerRootPage } from '@/components/HomePage/OwnerRootPage';
import { useAccount } from '@/hooks/account';

const Home = () => {
  const { isAgent, isInvestor } = useAccount();

  console.log('asset', isAgent);
  return (
    <>
      {!isAgent && <OwnerRootPage />}
      {isAgent && <AgentRootPage />}
      {isInvestor && <InvestorRootPage />}
    </>
  );
};

export default Home;
