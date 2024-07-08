import { useRouter } from '@/components/routing/useRouter';
import React, { useEffect } from 'react';

const Home: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace('/');
  }, []);

  return <div>rerouting</div>;
};

export default Home;
