'use client';

import { AgentRootPage } from '@/components/HomePage/AgentRootPage';
import { OwnerRootPage } from '@/components/HomePage/OwnerRootPage';
import { useAccount } from '@/hooks/account';

const Home = () => {
  const { isAgent } = useAccount();

  return (
    <>
      {!isAgent && <OwnerRootPage />}
      {isAgent && <AgentRootPage />}
    </>
  );
};

export default Home;
