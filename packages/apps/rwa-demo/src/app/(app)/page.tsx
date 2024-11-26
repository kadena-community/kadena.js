'use client';

import { AgentRootPage } from '@/components/HomePage/AgentRootPage';
import { InvestorRootPage } from '@/components/HomePage/InvestorRootPage';
import { OwnerRootPage } from '@/components/HomePage/OwnerRootPage';
import { useAccount } from '@/hooks/account';
import { getAsset } from '@/utils/getAsset';

const Home = () => {
  const { isAgent, isInvestor } = useAccount();

  console.log('asset', getAsset());
  return (
    <>
      {!isAgent && <OwnerRootPage />}
      {isAgent && <AgentRootPage />}
      {isInvestor && <InvestorRootPage />}
    </>
  );
};

export default Home;
