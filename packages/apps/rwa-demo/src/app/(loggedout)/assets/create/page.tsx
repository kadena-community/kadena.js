'use client';
import { AssetStepperForm } from '@/components/AssetForm/AssetStepperForm';
import { useAccount } from '@/hooks/account';
import { Card, Stack } from '@kadena/kode-ui';
import { CardContentBlock } from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cardWrapperClass } from '../../style.css';

const Home = () => {
  const { isMounted, account } = useAccount();
  const router = useRouter();

  // useEffect(() => {
  //   if (isMounted && !account) {
  //     router.replace('/login');
  //     return;
  //   }
  // }, [account, isMounted]);

  if (!isMounted || !account) return null;

  return (
    <Card fullWidth className={cardWrapperClass}>
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
    </Card>
  );
};

export default Home;
