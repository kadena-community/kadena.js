'use client';
import { useUser } from '@/hooks/user';

const Home = () => {
  const { userData } = useUser();

  return (
    <div>
      <h2>Response</h2>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
};

export default Home;
