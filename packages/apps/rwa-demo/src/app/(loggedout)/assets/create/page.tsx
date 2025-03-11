'use client';
import { AssetStepperForm } from '@/components/AssetForm/AssetStepperForm';
import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const { isMounted, account } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && !account) {
      router.replace('/login');
      return;
    }
  }, [account, isMounted]);

  if (!isMounted || !account) return null;

  return (
    <>
      <CardContentBlock title="Add an asset">
        <Stack
          flexDirection="column"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <AssetStepperForm />
        </Stack>
      </CardContentBlock>
    </>
  );
};

export default Home;
