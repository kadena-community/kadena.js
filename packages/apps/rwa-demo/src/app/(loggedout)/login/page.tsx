'use client';
import { useAccount } from '@/hooks/account';
import { Button } from '@kadena/kode-ui';
import { useRouter } from 'next/navigation';

const Home = () => {
  const { login } = useAccount();
  const router = useRouter();
  const handleConnect = async () => {
    await login();
    router.push('/');
  };

  return (
    <div>
      <Button onPress={handleConnect}>Connect</Button>
    </div>
  );
};

export default Home;
