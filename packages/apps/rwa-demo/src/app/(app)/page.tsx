'use client';

import { AgentRootPage } from '@/components/HomePage/AgentRootPage';
import { OwnerRootPage } from '@/components/HomePage/OwnerRootPage';
import { useAccount } from '@/hooks/account';
import { getAsset } from '@/utils/getAsset';

const Home = () => {
  const { isAgent } = useAccount();

  console.log('asset', getAsset());
  return (
    <>
      {!isAgent && <OwnerRootPage />}
      {isAgent && <AgentRootPage />}
    </>
  );
};

export default Home;
