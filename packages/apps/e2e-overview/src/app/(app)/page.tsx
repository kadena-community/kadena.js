'use client';
import { AllApps } from '@/components/AllApps/AllApps';
import { useUser } from '@/hooks/user';

const Home = () => {
  const { userData } = useUser();

  return (
    <div>
      <h2>Response</h2>
      <pre>{JSON.stringify(userData, null, 2)}</pre>

      <AllApps />
    </div>
  );
};

export default Home;
