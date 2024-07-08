import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Home: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/mainnet01');
  }, []);

  return <div>rerouting</div>;
};

export default Home;
